"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/*
 * Plays a green-screen video with the green removed, live, on a canvas.
 *
 * Why key at runtime rather than bake an alpha video: WebM can carry an alpha
 * channel (VP9 yuva420p) but Safari ignores it and renders the clip opaque, and
 * MP4/H.264 cannot carry alpha at all. Keying in a shader is one code path that
 * behaves the same in every browser, and it lets the key be tuned here in
 * source rather than re-exported.
 *
 * The shader is the standard chroma-distance key: convert both the pixel and
 * the key colour to UV chroma space, and fade out anything close to the key.
 * A second pass desaturates the leftover green rim so the subject does not
 * glow against a warm background.
 */

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  // Flip vertically: texture space is bottom-up, video frames are top-down.
  v_uv = vec2((a_position.x + 1.0) * 0.5, 1.0 - (a_position.y + 1.0) * 0.5);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D u_frame;
uniform vec3 u_key;
uniform float u_similarity;
uniform float u_smoothness;
uniform float u_despill;

varying vec2 v_uv;

vec2 toChroma(vec3 rgb) {
  return vec2(
    rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.500 + 0.5,
    rgb.r *  0.500 + rgb.g * -0.419 + rgb.b * -0.081 + 0.5
  );
}

void main() {
  vec4 frame = texture2D(u_frame, v_uv);

  float distanceFromKey = distance(toChroma(frame.rgb), toChroma(u_key));
  float edge = distanceFromKey - u_similarity;

  // Soft, slightly eased ramp — a hard cutoff leaves jagged hair and fabric.
  float alpha = pow(clamp(edge / u_smoothness, 0.0, 1.0), 1.5);

  /*
   * Green spill suppression. Where green outruns the mean of red and blue it
   * is bounce off the screen, not the garment, so pull it back to that mean.
   *
   * This is deliberately not a desaturation toward luminance: that washes the
   * colour out of anything near the key, which on this footage meant the navy
   * stripes turning grey. Clamping only the green channel leaves navy (b > g)
   * and burgundy (r > g) untouched while stripping the rim and the cast the
   * screen throws onto skin.
   */
  float meanRB = (frame.r + frame.b) * 0.5;
  vec3 colour = vec3(
    frame.r,
    mix(frame.g, min(frame.g, meanRB), u_despill),
    frame.b
  );

  gl_FragColor = vec4(colour, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("[chroma] shader failed", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

type VideoFrameCallback = (now: number, metadata: unknown) => void;

type FrameSchedulingVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: VideoFrameCallback) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export type ChromaVideoProps = {
  sources: { src: string; type: string }[];
  /**
   * Intrinsic pixel size of the footage. Optional: where it is not known ahead
   * of time — a clip that came from the database rather than from source — the
   * canvas resizes itself to the frame once the video reports its dimensions.
   * Pass it when you do know, so the canvas is right on the very first paint.
   */
  width?: number;
  height?: number;
  /** The green to remove, as 0–1 RGB. Sample it from an actual frame. */
  keyColor: [number, number, number];
  /**
   * Chroma distance below which a pixel is fully transparent. Measure it:
   * sample the screen across a frame, take the widest distance from the key,
   * and leave headroom under the closest colour in the subject.
   */
  similarity?: number;
  /** Width of the fade above `similarity`. Larger is softer. */
  smoothness?: number;
  /** Green-cast removal, 0–1. Safe at 1 — it only ever pulls green down. */
  despill?: number;
  className?: string;
  /** Applied to the canvas. `object-contain` where the box is not the frame. */
  canvasClassName?: string;
  poster?: string;
  /** Applied to the canvas — useful for grading the subject into a scene. */
  style?: CSSProperties;
};

export function ChromaVideo({
  sources,
  width,
  height,
  keyColor,
  similarity = 0.06,
  smoothness = 0.08,
  despill = 1,
  className,
  canvasClassName,
  poster,
  style,
}: ChromaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setPainting] = useState(false);

  useEffect(() => {
    const video = videoRef.current as FrameSchedulingVideo | null;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // premultipliedAlpha:false — the shader emits straight alpha, and letting
    // the browser assume otherwise puts a dark fringe around the subject.
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      alpha: true,
      antialias: false,
    });

    if (!gl) {
      console.warn("[chroma] no WebGL; falling back to the plain video");
      return;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[chroma] link failed", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // One full-screen triangle pair.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.uniform3fv(gl.getUniformLocation(program, "u_key"), keyColor);
    gl.uniform1f(gl.getUniformLocation(program, "u_similarity"), similarity);
    gl.uniform1f(gl.getUniformLocation(program, "u_smoothness"), smoothness);
    gl.uniform1f(gl.getUniformLocation(program, "u_despill"), despill);
    gl.viewport(0, 0, canvas.width, canvas.height);

    let painted = false;

    const draw = () => {
      if (video.readyState < 2) return;

      /*
       * Match the canvas to the frame. A no-op in the usual case where the
       * size was passed in; it earns its place when the clip's dimensions only
       * arrive with the video, which is when the canvas would otherwise stay
       * at its 300×150 default and resample the model down to a smear.
       */
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        video,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!painted) {
        painted = true;
        // Only reveal the canvas once it holds a real frame, so there is no
        // flash of empty box before the first paint.
        setPainting(true);
      }
    };

    /*
     * Frames are pumped by GSAP's ticker until requestVideoFrameCallback proves
     * it works, then by that alone. rVFC fires once per decoded frame (24 here
     * against a 60Hz display), so it is the cheaper of the two, but iOS Safari
     * has it and does not always fire it for a video it is not presenting.
     * Starting on the ticker means the model appears either way; there is
     * still only the one rAF loop (see AGENTS.md).
     */
    let handle = 0;
    let onTicker = true;
    gsap.ticker.add(draw);

    if (typeof video.requestVideoFrameCallback === "function") {
      const onFrame = () => {
        if (onTicker) {
          gsap.ticker.remove(draw);
          onTicker = false;
        }
        draw();
        handle = video.requestVideoFrameCallback!(onFrame);
      };
      handle = video.requestVideoFrameCallback(onFrame);
    }

    /*
     * iOS will not autoplay unless the element is muted as an attribute, not
     * only as a property, and React renders `muted` as a property alone. It
     * also ignores `preload`, so waiting for `loadeddata` before calling
     * play() waits forever: nothing loads until play() is called. So: mute
     * it every way there is, and ask to play straight away.
     */
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const play = () => {
      if (!video.paused) return;
      video.play().catch(() => {
        // Refused, usually Low Power Mode. The first touch or scroll counts
        // as permission, so try again then.
      });
    };

    play();
    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    const gestures = ["touchstart", "pointerdown", "scroll"] as const;
    for (const type of gestures) {
      window.addEventListener(type, play, { passive: true });
    }

    return () => {
      if (onTicker) gsap.ticker.remove(draw);
      video.cancelVideoFrameCallback?.(handle);

      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      for (const type of gestures) window.removeEventListener(type, play);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [keyColor, similarity, smoothness, despill]);

  return (
    <div className={cn("relative", className)}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-hidden
        // The pixel source for the shader, still on its green screen, so it
        // must not be seen. It is laid over the full box at 1% opacity rather
        // than shrunk to a pixel: iOS pauses muted video it judges invisible,
        // and a 1px box at opacity 0 is exactly that. At 1% the green adds a
        // couple of levels to the scene behind it, which no eye can see.
        className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-[0.01]"
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        aria-hidden
        style={style}
        className={cn(
          "h-full w-full transition-opacity duration-1000",
          isPainting ? "opacity-100" : "opacity-0",
          canvasClassName,
        )}
      />
    </div>
  );
}

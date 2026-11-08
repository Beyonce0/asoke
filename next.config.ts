import type { NextConfig } from "next";

/**
 * Product imagery is served from Supabase Storage, so next/image needs the
 * project host allow-listed. The URL is derived from the env var rather than
 * hard-coded so staging and production do not need separate configs.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    formats: ["image/avif", "image/webp"],
    // Next only serves qualities declared here; anything else is a 400. 85 is
    // for the full-bleed showcase photograph, where 75 shows banding in the
    // dark background gradient.
    qualities: [75, 85],
    /*
     * The optimizer rejects SVG by default because a hostile SVG can carry
     * script. Every SVG here is one we generate into /public ourselves —
     * never a user upload — and the sandbox below neutralises the risk
     * regardless. Revisit if uploaded SVGs ever become a thing.
     */
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline'",
  },
  experimental: {
    // GSAP and Lenis are large; keeping them out of the shared chunk keeps
    // first load small on pages that do not animate.
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;

/**
 * The atelier's green screen, measured once.
 *
 * Everything the house films is shot against the same screen under the same
 * lights, so the key belongs here rather than being re-derived at each call
 * site — the hero composite and the turn clip on a product page are looking at
 * the same green.
 *
 * Measured off the footage rather than guessed. The screen keys at #12C41C and
 * every green pixel lands within 0.024 of it in chroma space, while the closest
 * colour in the garment sits at 0.35 — a wide gap. So everything under 0.06
 * goes, the ramp closes by 0.16, and the navy stripes and skin are never
 * touched.
 *
 * If the lighting setup ever changes, re-measure before touching these: sample
 * the screen across a real frame, take the widest chroma distance from the key,
 * then check the closest colour in the subject.
 */
export const GREEN_SCREEN = {
  keyColor: [0.069, 0.767, 0.11] as [number, number, number],
  similarity: 0.06,
  smoothness: 0.1,
} as const;

/**
 * What delivery costs, in kobo.
 *
 * Deliberately not marked `server-only`: the checkout form has to show the
 * customer the same figure the server is about to charge, and the only way to
 * guarantee that is for both to call this one function. A second copy of the
 * rule in the browser would drift, and the drift would show up as a shop that
 * quotes one price and takes another.
 *
 * The server stays the authority regardless — `startCheckout` calls this again
 * with the state it actually received, and that result is what reaches
 * Paystack. What the browser computes is only what the browser shows.
 *
 * Flat rates for now. When a courier quote replaces them this becomes async
 * and the form will need to await it, which is why the total is already
 * assembled in one place rather than sprinkled through the markup.
 */
export const LAGOS_SHIPPING = 2_500_00;
export const NATIONAL_SHIPPING = 5_000_00;

export function shippingFor(state: string) {
  return /lagos/i.test(state) ? LAGOS_SHIPPING : NATIONAL_SHIPPING;
}

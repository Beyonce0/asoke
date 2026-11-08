import type { OrderStatus } from "@/types";

/*
 * The stages an order moves through, named once.
 *
 * TWO AUDIENCES, TWO VOCABULARIES. The atelier says "finishing"; the customer
 * reads "Final touches". Both come from this file so they can never drift into
 * describing different things — the bug where a dashboard says one thing and
 * the email to the customer says another.
 *
 * TWO ROUTES THROUGH ONE LIST. A piece off the shelf is paid for, packed and
 * posted. A commission is cut, fitted and finished first — weeks of work that
 * "processing" cannot express to somebody waiting on a wedding.
 *
 * Cancelled is not a stage. It is where a journey stops, so it sits apart from
 * the track rather than at the end of it.
 */

export type Stage = {
  value: OrderStatus;
  /** What the atelier calls it. */
  label: string;
  /** What the customer reads. */
  customer: string;
  /** Only shown for commissions. */
  atelier?: boolean;
};

export const STAGES: Stage[] = [
  { value: "pending", label: "Pending", customer: "Awaiting payment" },
  { value: "processing", label: "Processing", customer: "Being prepared" },
  {
    value: "cutting",
    label: "Cutting",
    customer: "Cloth being cut",
    atelier: true,
  },
  { value: "fitting", label: "Fitting", customer: "In fitting", atelier: true },
  {
    value: "finishing",
    label: "Finishing",
    customer: "Final touches",
    atelier: true,
  },
  { value: "ready", label: "Ready", customer: "Ready to send" },
  { value: "shipped", label: "Shipped", customer: "On its way" },
  { value: "delivered", label: "Delivered", customer: "Delivered" },
];

export const CANCELLED: Stage = {
  value: "cancelled",
  label: "Cancelled",
  customer: "Cancelled",
};

const BY_VALUE = new Map(
  [...STAGES, CANCELLED].map((stage) => [stage.value, stage]),
);

export function stageFor(status: OrderStatus): Stage {
  return BY_VALUE.get(status) ?? CANCELLED;
}

/** How far along the track a status sits. `-1` for cancelled. */
export function stageIndex(status: OrderStatus) {
  return STAGES.findIndex((stage) => stage.value === status);
}

/**
 * The colour a status carries wherever it is shown. Gold is the atelier's own
 * work in progress, cream the road, green arrival.
 */
export function stageTone(status: OrderStatus) {
  if (status === "cancelled") return "text-danger";
  if (status === "delivered") return "text-success";
  if (status === "pending") return "text-muted";
  if (status === "shipped" || status === "ready") return "text-cream";
  return "text-gold";
}

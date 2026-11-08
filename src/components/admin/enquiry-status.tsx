"use client";

import { StatusButtons } from "@/components/admin/status-buttons";
import { setEnquiryStatus } from "@/app/admin/inbox/actions";
import type { EnquiryStatus } from "@/types";

const OPTIONS: {
  value: EnquiryStatus;
  label: string;
  tone?: "success" | "danger";
}[] = [
  { value: "new", label: "Unanswered" },
  { value: "replied", label: "Replied", tone: "success" },
  { value: "closed", label: "Closed" },
];

export function EnquiryStatusPicker({
  id,
  status,
}: {
  id: string;
  status: EnquiryStatus;
}) {
  return (
    <StatusButtons
      value={status}
      options={OPTIONS}
      onSelect={(next) => setEnquiryStatus({ id, status: next })}
    />
  );
}

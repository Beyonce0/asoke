import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** The single source of horizontal rhythm. Every section should use it. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[92rem] px-6 md:px-10", className)}
      {...props}
    />
  );
}

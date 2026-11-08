"use client";

import { useEffect } from "react";

import { useCart } from "@/store/cart";

/** Empties the bag once payment has been confirmed server side. */
export function ClearCart() {
  const { clear, isHydrated } = useCart();

  useEffect(() => {
    if (isHydrated) clear();
    // `clear` is stable for the life of the provider; running once is correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  return null;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { CartLine } from "@/types";

const STORAGE_KEY = "asoke.cart.v1";

type CartState = { lines: CartLine[] };

type CartAction =
  | { type: "add"; line: CartLine }
  | { type: "remove"; variantId: string }
  | { type: "setQuantity"; variantId: string; quantity: number }
  | { type: "clear" };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find(
        (line) => line.variantId === action.line.variantId,
      );

      if (!existing) return { lines: [...state.lines, action.line] };

      return {
        lines: state.lines.map((line) =>
          line.variantId === action.line.variantId
            ? { ...line, quantity: line.quantity + action.line.quantity }
            : line,
        ),
      };
    }

    case "remove":
      return {
        lines: state.lines.filter(
          (line) => line.variantId !== action.variantId,
        ),
      };

    case "setQuantity": {
      if (action.quantity < 1) {
        return {
          lines: state.lines.filter(
            (line) => line.variantId !== action.variantId,
          ),
        };
      }

      return {
        lines: state.lines.map((line) =>
          line.variantId === action.variantId
            ? { ...line, quantity: action.quantity }
            : line,
        ),
      };
    }

    case "clear":
      return { lines: [] };
  }
}

/** Seeds straight from localStorage so no effect has to backfill the cart. */
function init(): CartState {
  if (typeof window === "undefined") return { lines: [] };

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return { lines: stored ? (JSON.parse(stored) as CartLine[]) : [] };
  } catch {
    // Corrupt or blocked storage — start empty rather than crash the app.
    return { lines: [] };
  }
}

const noopSubscribe = () => () => {};

type CartContextValue = {
  lines: CartLine[];
  /** Kobo. Display only — checkout re-prices from the database. */
  subtotal: number;
  count: number;
  /** False on the server and through hydration, true once mounted. */
  isHydrated: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (line: CartLine) => void;
  remove: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const [isOpen, setOpen] = useState(false);

  /*
   * The server has no cart, so the first client render must match it — every
   * consumer holds off on cart contents until this flips. useSyncExternalStore
   * is the sanctioned way to get that: it serves the server snapshot through
   * hydration, then the client one.
   */
  const isHydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Private mode or a full quota. Losing persistence is not worth a crash.
    }
  }, [state.lines]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.lines.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0,
    );
    const count = state.lines.reduce((sum, line) => sum + line.quantity, 0);

    return {
      lines: state.lines,
      subtotal,
      count,
      isHydrated,
      isOpen,
      setOpen,
      add: (line) => {
        dispatch({ type: "add", line });
        setOpen(true);
      },
      remove: (variantId) => dispatch({ type: "remove", variantId }),
      setQuantity: (variantId, quantity) =>
        dispatch({ type: "setQuantity", variantId, quantity }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.lines, isHydrated, isOpen]);

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}

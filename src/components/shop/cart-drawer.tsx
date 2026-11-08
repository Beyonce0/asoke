"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import { useCart } from "@/store/cart";
import { formatNaira } from "@/lib/utils";

export function CartDrawer() {
  const { lines, subtotal, isOpen, setOpen, remove, setQuantity } = useCart();
  const { t } = useI18n();

  // Escape should close the drawer wherever focus happens to be.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setOpen(false)}
            className="bg-charcoal/80 fixed inset-0 z-[60] backdrop-blur-[2px]"
          />

          <motion.aside
            role="dialog"
            aria-label={t.bag.title}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            // Lenis must not eat the wheel events inside a scrollable panel.
            data-lenis-prevent
            // Surface, not base — the drawer has to lift off the page behind it.
            className="bg-surface fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col"
          >
            <header className="border-line flex items-center justify-between border-b px-6 py-5">
              <h2 className="font-sans text-[0.7rem] tracking-[0.24em] uppercase">
                {t.bag.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t.bag.close}
                className="text-cream-soft hover:text-cream -mr-2 p-2"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
                <p className="text-muted text-sm">{t.bag.empty}</p>
                <ButtonLink
                  href="/shop"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  {t.bag.browse}
                </ButtonLink>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6">
                  {lines.map((line) => (
                    <li
                      key={line.variantId}
                      className="border-line/70 flex gap-4 border-b py-6 last:border-0"
                    >
                      <div className="bg-surface relative h-28 w-20 shrink-0 overflow-hidden">
                        {line.image && (
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-sans text-sm">{line.name}</h3>
                          <p className="text-muted mt-1 text-xs">
                            {line.variantLabel}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="border-line flex items-center border">
                            <button
                              type="button"
                              aria-label={t.bag.decrease}
                              onClick={() =>
                                setQuantity(line.variantId, line.quantity - 1)
                              }
                              className="text-cream-soft hover:text-cream px-2 py-1.5"
                            >
                              <Minus size={13} strokeWidth={1.5} />
                            </button>
                            <span className="min-w-7 text-center text-xs tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={t.bag.increase}
                              onClick={() =>
                                setQuantity(line.variantId, line.quantity + 1)
                              }
                              className="text-cream-soft hover:text-cream px-2 py-1.5"
                            >
                              <Plus size={13} strokeWidth={1.5} />
                            </button>
                          </div>

                          <p className="text-sm tabular-nums">
                            {formatNaira(line.unitPrice * line.quantity)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(line.variantId)}
                        className="text-muted hover:text-danger self-start text-[0.65rem] tracking-[0.14em] uppercase"
                      >
                        {t.bag.remove}
                      </button>
                    </li>
                  ))}
                </ul>

                <footer className="border-line border-t px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.7rem] tracking-[0.2em] uppercase">
                      {t.bag.subtotal}
                    </span>
                    <span className="text-lg tabular-nums">
                      {formatNaira(subtotal)}
                    </span>
                  </div>
                  <p className="text-muted mt-2 text-xs">
                    {t.bag.shippingNote}
                  </p>
                  <ButtonLink
                    href="/checkout"
                    size="lg"
                    onClick={() => setOpen(false)}
                    className="mt-5 w-full"
                  >
                    {t.bag.checkout}
                  </ButtonLink>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="text-muted hover:text-cream mt-4 block text-center text-xs underline underline-offset-4"
                  >
                    {t.bag.viewFull}
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

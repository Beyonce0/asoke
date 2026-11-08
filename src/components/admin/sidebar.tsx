"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Scissors,
  Settings,
  Shirt,
  Sparkles,
  SwatchBook,
  Globe,
  X,
} from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";

/*
 * The atelier's own navigation.
 *
 * Sections that do not exist yet are listed and greyed rather than hidden. The
 * shape of the dashboard is the plan made visible — you can see what is coming
 * and in what order — and a link to a route that 404s is worse than a label
 * that says "soon".
 */

type Item = {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  /** False until the section is built. Rendered, but not a link. */
  ready?: boolean;
};

const CATALOGUE: Item[] = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, ready: true },
  { href: "/admin/products", label: "Products", Icon: Shirt, ready: true },
  {
    href: "/admin/collections",
    label: "Collections",
    Icon: SwatchBook,
    ready: true,
  },
  { href: "/admin/fabrics", label: "Fabrics", Icon: Scissors, ready: true },
  {
    href: "/admin/bespoke",
    label: "Bespoke orders",
    Icon: Sparkles,
    ready: true,
  },
  {
    href: "/admin/appointments",
    label: "Appointments",
    Icon: CalendarDays,
    ready: true,
  },
  { href: "/admin/inbox", label: "Enquiries", Icon: Inbox, ready: true },
  { href: "/admin/orders", label: "Orders", Icon: Package, ready: true },
  {
    href: "/admin/media",
    label: "Media library",
    Icon: Images,
    ready: true,
  },
];

const SYSTEM: Item[] = [
  { href: "/", label: "View website", Icon: Globe, ready: true },
  { href: "/admin/settings", label: "Settings", Icon: Settings, ready: true },
];

function Row({
  item,
  active,
  onNavigate,
}: {
  item: Item;
  active: boolean;
  /** Closes the drawer on a phone. A no-op where it is a static column. */
  onNavigate: () => void;
}) {
  const content = (
    <>
      <item.Icon size={16} strokeWidth={1.5} aria-hidden />
      <span className="truncate">{item.label}</span>
      {!item.ready && (
        <span className="text-muted/70 ml-auto text-[0.55rem] tracking-[0.2em] uppercase">
          Soon
        </span>
      )}
    </>
  );

  const shared =
    "flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.8rem] transition-colors";

  if (!item.ready) {
    return (
      <span
        aria-disabled
        className={cn(shared, "text-muted/55 cursor-not-allowed")}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        shared,
        active
          ? "bg-gold/10 text-gold"
          : "text-cream-soft hover:bg-cream/5 hover:text-cream",
      )}
    >
      {content}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /*
   * Closed by the link that navigates rather than by watching the path change:
   * a menu still covering the page you just asked for is the classic mobile
   * nav bug, and doing it here keeps it out of an effect that would fire a
   * second render every time the route moves.
   */
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/*
        The phone header. It holds the only way into the navigation on a small
        screen, so it stays put while the page scrolls under it.
      */}
      <header className="border-line bg-surface sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          aria-expanded={open}
          className="text-cream-soft hover:text-cream -ml-2 p-2"
        >
          <Menu size={20} strokeWidth={1.5} aria-hidden />
        </button>

        <p translate="no" className="wordmark text-cream text-sm">
          Àṣọké
        </p>
        <p className="text-gold/70 ml-auto text-[0.5rem] tracking-[0.28em] uppercase">
          Atelier
        </p>
      </header>

      {/* Tap-anywhere-else to dismiss. Hidden from the tree — the close button
          inside the drawer is the accessible way out. */}
      {open && (
        <div
          aria-hidden
          onClick={close}
          className="bg-charcoal/70 fixed inset-0 z-40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <nav
        aria-label="Atelier admin"
        /*
         * One element, two behaviours: a slide-over pinned to the viewport on
         * a phone, and an ordinary column in the layout's flex row from `lg`.
         * `translate-x` rather than mounting and unmounting, so it can be
         * animated and so its scroll position survives being closed.
         */
        className={cn(
          "border-line bg-surface fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r transition-transform duration-300 ease-out",
          "lg:static lg:h-auto lg:translate-x-0 lg:transition-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-line flex items-start justify-between border-b px-6 py-7">
          <div>
            <p translate="no" className="wordmark text-cream text-base">
              Àṣọké
            </p>
            <p className="text-gold/80 mt-2 text-[0.55rem] tracking-[0.32em] uppercase">
              Atelier admin
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close navigation"
            className="text-muted hover:text-cream -mt-1 -mr-2 p-2 lg:hidden"
          >
            <X size={18} strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-0.5">
            {CATALOGUE.map((item) => (
              <li key={item.href}>
                <Row
                  item={item}
                  active={pathname === item.href}
                  onNavigate={close}
                />
              </li>
            ))}
          </ul>

          <hr className="border-line my-4" />

          <ul className="space-y-0.5">
            {SYSTEM.map((item) => (
              <li key={item.href}>
                <Row
                  item={item}
                  active={pathname === item.href}
                  onNavigate={close}
                />
              </li>
            ))}
          </ul>
        </div>

        <form action={signOut} className="border-line border-t p-3">
          <button
            type="submit"
            className="text-cream-soft hover:bg-cream/5 hover:text-cream flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[0.8rem] transition-colors"
          >
            <LogOut size={16} strokeWidth={1.5} aria-hidden />
            Sign out
          </button>
        </form>
      </nav>
    </>
  );
}

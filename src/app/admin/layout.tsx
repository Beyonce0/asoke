import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminSidebar } from "@/components/admin/sidebar";
import { isConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/*
 * The admin shell, and the second of three locks on it.
 *
 * 1. `proxy.ts` turns anonymous visitors away at the door — cheap, and it
 *    stops a stranger ever seeing this render.
 * 2. Here: is this signed-in person actually an admin. `notFound()` rather
 *    than a redirect, so a customer who guesses the URL learns only that
 *    /admin is not a page.
 * 3. RLS on every query the dashboard makes. Even if 1 and 2 were both wrong,
 *    Postgres would still refuse to hand over a draft product.
 *
 * The check reads the profile with the user's own session — `getUser()`, never
 * `getSession()`, because only the former revalidates the token against
 * Supabase rather than trusting a cookie.
 */

export const metadata: Metadata = {
  title: "Atelier admin",
  // Nothing here should ever appear in a search result.
  robots: { index: false, follow: false },
};

/*
 * Column and content. Only a row from `lg` up — below that the sidebar is a
 * slide-over pinned to the viewport and takes no space in the flow, so the
 * content must be free to fill the screen rather than sit in a flex child
 * beside something that is not there.
 */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-charcoal min-h-dvh lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  /*
   * No Supabase project yet — so there is no account to be an admin of, and no
   * lock worth checking. Rather than bounce to a sign-in that cannot work, the
   * dashboard renders against the sample catalogue exactly as the storefront
   * does, behind a banner that says so.
   *
   * Nothing here can leak: there is no database to read and every write path
   * is refused. And it is unreachable in production, where `lib/env.ts` throws
   * on a half-configured boot rather than falling back to placeholders.
   */
  if (!isConfigured) {
    return (
      <Shell>
        <p className="border-gold/25 bg-gold/10 text-cream-soft border-b px-8 py-3 text-xs leading-relaxed md:px-12">
          <span className="text-gold tracking-[0.2em] uppercase">Preview:</span>{" "}
          Supabase is not connected, so this is sample data and nothing saves.
          Fill <code className="text-gold">.env.local</code>, run the migrations
          in <code className="text-gold">supabase/migrations</code>, then
          promote yourself with the statement at the foot of{" "}
          <code className="text-gold">0004_admin_role.sql</code>.
        </p>
        {children}
      </Shell>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") notFound();

  return <Shell>{children}</Shell>;
}

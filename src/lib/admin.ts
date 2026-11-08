import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * The gate every admin write goes through first.
 *
 * Not the only one — RLS refuses the write regardless, and that is the lock
 * that actually holds. This is here so a mistake surfaces as a clear error at
 * the top of an action rather than as a silent zero-row update forty lines
 * down, and so an action cannot be reached at all by a signed-out request.
 *
 * Returns the admin's own client, so a caller cannot accidentally check
 * permission with one session and then write with another.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not signed in.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") throw new Error("Not an admin.");

  return { supabase, user };
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { env, isConfigured } from "@/lib/env";

/**
 * Routes that require a signed-in user. Checkout is deliberately absent —
 * guest checkout is supported, so orders may carry a null user_id.
 *
 * `/admin` only gets as far as "signed in" here. Being an admin is checked in
 * the admin layout and enforced by RLS on every query it makes — this is the
 * cheap first door, not the lock.
 */
const PROTECTED_PREFIXES = ["/account", "/admin"];

/**
 * Refreshes the Supabase auth cookie on every request and gates private routes.
 * Server components cannot write cookies, so the refresh has to happen here.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  /*
   * With no Supabase project there is no session to refresh and no account to
   * sign in to, so gating would bounce every protected route to a sign-in page
   * that cannot work. Let them through to render their own "not connected"
   * state instead.
   *
   * This can only ever be true in development: `lib/env.ts` throws on a
   * half-configured production boot rather than falling back to placeholders.
   */
  if (!isConfigured) return response;

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Must be getUser(), not getSession() — only getUser() revalidates the token
  // against Supabase. getSession() trusts a cookie the client could forge.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!user && needsAuth) {
    const signIn = request.nextUrl.clone();
    signIn.pathname = "/sign-in";
    signIn.searchParams.set("next", pathname);
    return NextResponse.redirect(signIn);
  }

  return response;
}

import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next 16 renamed the `middleware` convention to `proxy`; the behaviour is
 * unchanged. Runs before every matched request.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files. The Paystack webhook is
     * excluded too — it arrives without cookies and verifies its own signature.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/paystack/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff2?)$).*)",
  ],
};

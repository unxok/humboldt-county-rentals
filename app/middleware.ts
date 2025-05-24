import { updateSession } from "@/lib/supabase/middleware";
import { tryCatch } from "@/lib/utils";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // update user's auth session
  console.log("middleware start");
  const result = await tryCatch(updateSession(request));
  if (!result.success) {
    console.error("middleware error: ", result.error);
    return;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Also, disable the middleware on prefetch calls.
     * Feel free to modify this pattern to include more paths.
     */
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

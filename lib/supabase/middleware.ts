import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function updateSession() {
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        // @ts-ignore TODO
        setAll(cookiesToSet, _headers) {
          try {
            // @ts-ignore TODO
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  // refreshing the auth token
  await client.auth.getUser();

  return client;
}

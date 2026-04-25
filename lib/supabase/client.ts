import { createBrowserClient } from "@supabase/ssr";
import { AUTH_COOKIE_MAX_AGE } from "@/lib/constants";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        maxAge: AUTH_COOKIE_MAX_AGE,
      },
    },
  );
}

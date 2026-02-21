import { createClient } from "@/lib/supabase/server";
import PageLogin from "@/components/page/page-login";

interface AuthLoginProps {
  children: React.ReactNode;
}

export default async function AuthLogin({ children }: AuthLoginProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <PageLogin />;
  }

  return <>{children}</>;
}

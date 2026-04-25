import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import HeaderCenter from "./header-center";
import HeaderLeft from "./header-left";
import HeaderRight from "./header-right";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="header__container line">
      <div className="flex items-center justify-center md:justify-between">
        {/* 왼쪽 */}
        <div className="hidden md:block">
          <HeaderLeft />
        </div>

        {/* 로고 */}
        <div>
          <HeaderCenter />
        </div>

        {/* 오른쪽 */}
        <div className="hidden md:block">
          <HeaderRight user={user} profile={profile} />
        </div>
      </div>
    </header>
  );
}

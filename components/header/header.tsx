import { createClient } from "@/lib/supabase/server";
import HeaderCenter from "./header-center";
import HeaderLeft from "./header-left";
import HeaderRight from "./header-right";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          <HeaderRight user={user} />
        </div>
      </div>
    </header>
  );
}

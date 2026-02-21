"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";
import {
  Bell,
  CreditCard,
  LogOut,
  MoreVertical,
  UserCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AdminNavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u ?? null);
      if (u) {
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", u.id)
          .single();
        setProfile(p ?? null);
      } else {
        setProfile(null);
      }
    };
    load();
  }, []);

  const userData = profile
    ? {
        name: profile.full_name || "",
        email: profile.email || "",
        avatar: profile.avatar_url || "",
      }
    : user
      ? {
          name: user.user_metadata?.display_name || "",
          email: user.email || "",
          avatar: user.user_metadata?.avatar_url || "",
        }
      : { name: "Admin", email: "", avatar: "" };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("로그아웃 되었습니다.");
    router.push("/login");
    router.refresh();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {userData.avatar ? (
                <div className="bg-red-100 p-1 rounded-full w-9 h-9 overflow-hidden">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="h-8 w-8 object-cover"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center">
                  <UserCircle className="h-5 w-5 text-gray-600" />
                </div>
              )}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {userData.email}
                </span>
              </div>
              <MoreVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircle />
                eventzoa.com
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                cafezoa.com
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                runzoa.com
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

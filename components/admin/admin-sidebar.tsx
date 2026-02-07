"use client";

import Image from "next/image";
import * as React from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";
import { APP_NAME } from "@/lib/constants";
import { AdminNavMain } from "./admin-nav-main";
import { AdminNavUser } from "./admin-nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar({
  user,
  profile,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: User | null;
  profile?: Profile | null;
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <h1 className="flex items-center justify-center bg-gray-200 py-6">
                <Image
                  src="/svg/favicon.svg"
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-7 h-7"
                />
                <span className="text-xl font-semibold font-paperlogy">
                  {APP_NAME} 관리자
                </span>
              </h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser user={user} profile={profile} />
      </SidebarFooter>
    </Sidebar>
  );
}

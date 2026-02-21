import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminSiteHeader } from "@/components/admin/admin-site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AdminAccessDenied from "@/components/admin/admin-access-denied";
import AuthAdminGate from "@/components/auth/auth-admin-gate";

const ADMIN_VERIFIED_COOKIE = "admin_verified";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return <AdminAccessDenied />;
  }

  const cookieStore = await cookies();
  const verified = !!cookieStore.get(ADMIN_VERIFIED_COOKIE)?.value;

  return (
    <AuthAdminGate verified={verified}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AdminSidebar user={user} profile={profile} />
        <SidebarInset>
          <AdminSiteHeader />
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthAdminGate>
  );
}

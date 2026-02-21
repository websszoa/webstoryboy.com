import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!myProfile || myProfile.role !== "admin") {
    redirect("/");
  }

  const adminSupabase = createServiceRoleClient();

  let stats = {
    membersCount: 0,
    contactsCount: 0,
    contactsPendingCount: 0,
  };

  if (adminSupabase) {
    const [
      { count: membersCount },
      { count: contactsCount },
      { count: contactsPendingCount },
    ] = await Promise.all([
      adminSupabase
        .from("profiles")
        .select("*", { count: "exact", head: true }),
      adminSupabase
        .from("contacts")
        .select("*", { count: "exact", head: true }),
      adminSupabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);
    stats = {
      membersCount: membersCount ?? 0,
      contactsCount: contactsCount ?? 0,
      contactsPendingCount: contactsPendingCount ?? 0,
    };
  }

  return <AdminDashboard stats={stats} />;
}

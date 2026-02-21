import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const [
    { count: membersCount },
    { count: contactsCount },
    { count: contactsPendingCount },
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false),
    supabaseAdmin
      .from("contacts")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const stats = {
    membersCount: membersCount ?? 0,
    contactsCount: contactsCount ?? 0,
    contactsPendingCount: contactsPendingCount ?? 0,
  };

  return <AdminDashboard stats={stats} />;
}

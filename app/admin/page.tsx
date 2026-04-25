import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminDashboardPage() {
  const [{ data: members }, { data: contacts }] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <AdminDashboard members={members ?? []} contacts={contacts ?? []} />
  );
}

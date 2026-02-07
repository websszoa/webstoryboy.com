import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { VisitorEnvironment } from "@/lib/types";
import AdminVisitorEnvironments from "@/components/admin/admin-visitor-environments";

export default async function AdminVisitorsPage() {
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
  if (!adminSupabase) {
    return <AdminVisitorEnvironments initialVisitors={[]} />;
  }
  const { data: rows } = await adminSupabase
    .from("visitor_environments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  const list = (rows ?? []) as VisitorEnvironment[];

  return <AdminVisitorEnvironments initialVisitors={list} />;
}

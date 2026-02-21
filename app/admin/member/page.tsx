import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import AdminMember from "@/components/admin/admin-member";

export default async function AdminMemberPage() {
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
    return <AdminMember initialMembers={[]} />;
  }
  const { data: profiles } = await adminSupabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (profiles ?? []) as Profile[];

  return <AdminMember initialMembers={list} />;
}

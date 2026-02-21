import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { Contact } from "@/lib/types";
import AdminContact from "@/components/admin/admin-contact";

export default async function AdminContactPage() {
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
    return <AdminContact initialContacts={[]} />;
  }
  const { data: contacts } = await adminSupabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (contacts ?? []) as Contact[];

  return <AdminContact initialContacts={list} />;
}

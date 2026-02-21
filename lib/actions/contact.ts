"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ContactStatus = "pending" | "progress" | "resolved" | "closed";

export async function updateContactByAdmin(params: {
  id: string;
  status: ContactStatus;
  adminReply: string;
}) {
  const { id, status, adminReply } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  const profile = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile.data?.role !== "admin") {
    throw new Error("관리자만 수정할 수 있습니다.");
  }

  const adminSupabase = createServiceRoleClient();
  if (!adminSupabase) {
    throw new Error("서버 설정 오류입니다.");
  }

  const resolvedAt =
    status === "resolved" || status === "closed" ? new Date().toISOString() : null;

  const updatePayload = {
    status,
    admin_reply: adminReply.trim() || null,
    admin_id: user.id,
    resolved_at: resolvedAt,
    updated_at: new Date().toISOString(),
  };

  const fromContacts = adminSupabase.from("contacts");
  const { data, error } = await fromContacts
    // DB 타입 미생성 시 update 인자가 never로 추론됨
    // @ts-expect-error - contacts 테이블 업데이트
    .update(updatePayload)
    .eq("id", id)
    .select("status, admin_reply, admin_id, resolved_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/contact");

  const row = data as {
    status: ContactStatus;
    admin_reply: string | null;
    admin_id: string | null;
    resolved_at: string | null;
  };

  return {
    status: row.status,
    admin_reply: row.admin_reply,
    admin_id: row.admin_id,
    resolved_at: row.resolved_at,
  };
}

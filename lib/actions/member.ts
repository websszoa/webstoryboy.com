"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateMemberByAdmin(params: {
  id: string;
  full_name: string | null;
  role: string;
  visit_count: number;
  is_deleted: boolean;
  created_at: string | null;
}) {
  const { id, full_name, role, visit_count, is_deleted, created_at } = params;

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

  const deletedAt = is_deleted ? new Date().toISOString() : null;
  const updatePayload = {
    full_name: full_name?.trim() || null,
    role: role === "admin" ? "admin" : "user",
    visit_count: Math.max(0, visit_count),
    is_deleted,
    deleted_at: deletedAt,
    created_at: created_at ?? undefined,
    updated_at: new Date().toISOString(),
  };

  const fromProfiles = adminSupabase.from("profiles");
  const { data, error } = await fromProfiles
    // @ts-expect-error - DB 타입 미생성 시 update 인자가 never로 추론됨
    .update(updatePayload)
    .eq("id", id)
    .select("full_name, role, visit_count, is_deleted, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/member");

  const row = data as {
    full_name: string | null;
    role: string | null;
    visit_count: number;
    is_deleted: boolean;
    created_at: string | null;
  };

  return {
    full_name: row.full_name,
    role: row.role,
    visit_count: row.visit_count,
    is_deleted: row.is_deleted,
    created_at: row.created_at,
  };
}

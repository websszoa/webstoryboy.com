import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!myProfile || myProfile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    full_name?: string;
    email?: string;
    role?: string;
    visit_count?: number;
    is_deleted?: boolean;
  };
  try {
    body = await _request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (body.full_name !== undefined) updates.full_name = body.full_name;
  if (body.email !== undefined) updates.email = body.email;
  if (body.role !== undefined) {
    if (!["user", "admin"].includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    updates.role = body.role;
  }
  if (body.visit_count !== undefined) {
    const n = Number(body.visit_count);
    if (!Number.isInteger(n) || n < 0) {
      return NextResponse.json(
        { error: "visit_count must be a non-negative integer" },
        { status: 400 },
      );
    }
    updates.visit_count = n;
  }
  if (body.is_deleted !== undefined) {
    updates.is_deleted = !!body.is_deleted;
    updates.deleted_at = body.is_deleted ? new Date().toISOString() : null;
  }

  const adminSupabase = createServiceRoleClient();
  const { error } = await adminSupabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

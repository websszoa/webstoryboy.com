"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Profile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { RefreshCw, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminMemberProps {
  initialMembers: Profile[];
}

export default function AdminMember({ initialMembers }: AdminMemberProps) {
  const router = useRouter();
  const [members, setMembers] = useState<Profile[]>(initialMembers);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"user" | "admin">("user");
  const [editVisitCount, setEditVisitCount] = useState(0);
  const [editIsDeleted, setEditIsDeleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openDetail = (member: Profile) => {
    setSelectedMember(member);
    setEditFullName(member.full_name ?? "");
    setEditEmail(member.email ?? "");
    setEditRole(
      (member.role === "admin" ? "admin" : "user") as "user" | "admin",
    );
    setEditVisitCount(member.visit_count ?? 0);
    setEditIsDeleted(member.is_deleted ?? false);
  };

  const handleSave = async () => {
    if (!selectedMember) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/profiles/${selectedMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: editFullName || null,
          email: editEmail || null,
          role: editRole,
          visit_count: editVisitCount,
          is_deleted: editIsDeleted,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "저장 실패");
      }
      toast.success("저장되었습니다.");
      setSelectedMember(null);
      router.refresh();
      setMembers((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id
            ? {
                ...m,
                full_name: editFullName || null,
                email: editEmail || null,
                role: editRole,
                visit_count: editVisitCount,
                is_deleted: editIsDeleted,
              }
            : m,
        ),
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "저장 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
            회원 관리
          </h1>
          <p className="text-sm text-muted-foreground font-anyvid mt-1">
            전체 회원 목록을 확인하고 관리할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            전체 회원
          </p>
          <p className="text-2xl font-semibold font-paperlogy">
            {members.length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            활성 회원
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-green-600">
            {members.filter((m) => !m.is_deleted).length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            탈퇴 회원
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-red-600">
            {members.filter((m) => m.is_deleted).length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">관리자</p>
          <p className="text-2xl font-semibold font-paperlogy text-brand">
            {members.filter((m) => m.role === "admin").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden font-anyvid">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[80px] text-center">이미지</TableHead>
              <TableHead className="">이름</TableHead>
              <TableHead className="">이메일</TableHead>
              <TableHead className=" text-center">역할</TableHead>
              <TableHead className=" text-center">방문</TableHead>
              <TableHead className=" text-center">상태</TableHead>
              <TableHead className="">가입일</TableHead>
              <TableHead className="w-[80px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">
                      로딩 중...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <p className="text-muted-foreground">
                    등록된 회원이 없습니다.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 mx-auto">
                      <Image
                        src={member.avatar_url || "/face/face01.png"}
                        alt={member.full_name || "프로필"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-nanumNeo font-medium">
                    {member.full_name || "-"}
                  </TableCell>
                  <TableCell className="font-nanumNeo text-muted-foreground">
                    {member.email || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        member.role === "admin" ? "default" : "secondary"
                      }
                      className={
                        member.role === "admin"
                          ? "bg-brand hover:bg-brand/90"
                          : ""
                      }
                    >
                      {member.role === "admin" ? "관리자" : "회원"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-nanumNeo">
                    {member.visit_count}회
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={member.is_deleted ? "destructive" : "outline"}
                      className={
                        !member.is_deleted
                          ? "border-green-500 text-green-600"
                          : ""
                      }
                    >
                      {member.is_deleted ? "탈퇴" : "활성"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-nanumNeo text-muted-foreground">
                    {formatDate(member.created_at) || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 font-anyvid"
                      onClick={() => openDetail(member)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      보기
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 회원 수정 다이얼로그 */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-paperlogy">회원 정보 수정</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4 font-anyvid">
              <div>
                <Label className="text-sm text-muted-foreground">이름</Label>
                <Input
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="이름"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">이메일</Label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="이메일"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">역할</Label>
                <Select
                  value={editRole}
                  onValueChange={(v) => setEditRole(v as "user" | "admin")}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">회원</SelectItem>
                    <SelectItem value="admin">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">
                  방문 횟수
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={editVisitCount}
                  onChange={(e) =>
                    setEditVisitCount(parseInt(e.target.value, 10) || 0)
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">상태</Label>
                <Select
                  value={editIsDeleted ? "deleted" : "active"}
                  onValueChange={(v) => setEditIsDeleted(v === "deleted")}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="deleted">탈퇴</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedMember(null)}
              className="font-anyvid"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="font-anyvid"
            >
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

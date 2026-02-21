"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Contact } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { RefreshCw, MessageSquare, Eye } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

interface AdminContactProps {
  initialContacts: Contact[];
}

// 상태 뱃지
function getStatusBadge(status: Contact["status"]) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">대기</Badge>;
    case "in_progress":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">처리중</Badge>
      );
    case "resolved":
      return <Badge className="bg-green-500 hover:bg-green-600">완료</Badge>;
    case "closed":
      return <Badge variant="outline">종료</Badge>;
    default:
      return <Badge variant="outline">-</Badge>;
  }
}

export default function AdminContact({ initialContacts }: AdminContactProps) {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editStatus, setEditStatus] = useState<Contact["status"]>("pending");
  const [editReply, setEditReply] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const openDetail = (contact: Contact) => {
    setSelectedContact(contact);
    setEditStatus(contact.status);
    setEditReply(contact.admin_reply ?? "");
  };

  const handleSave = async () => {
    if (!selectedContact) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/contacts/${selectedContact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          admin_reply: editReply || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "저장 실패");
      }
      toast.success("저장되었습니다.");
      setSelectedContact(null);
      router.refresh();
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? { ...c, status: editStatus, admin_reply: editReply || null }
            : c,
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

  const handleRefresh = () => {
    setIsLoading(true);
    router.refresh();
    setTimeout(() => setIsLoading(false), 500);
  };

  // 통계 계산
  const totalCount = contacts.length;
  const pendingCount = contacts.filter((c) => c.status === "pending").length;
  const inProgressCount = contacts.filter(
    (c) => c.status === "in_progress",
  ).length;
  const resolvedCount = contacts.filter((c) => c.status === "resolved").length;

  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
            문의 관리
          </h1>
          <p className="text-sm text-muted-foreground font-anyvid mt-1">
            사용자 문의를 확인하고 답변할 수 있습니다.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="font-anyvid text-sm text-muted-foreground"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
          />
          새로고침
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            전체 문의
          </p>
          <p className="text-2xl font-semibold font-paperlogy">{totalCount}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            대기 중
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-gray-600">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            처리 중
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-yellow-600">
            {inProgressCount}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">완료</p>
          <p className="text-2xl font-semibold font-paperlogy text-green-600">
            {resolvedCount}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden font-anyvid">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead className="max-w-[300px]">문의 내용</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-center">답변</TableHead>
              <TableHead className="">문의일</TableHead>
              <TableHead className="w-[80px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">
                      로딩 중...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      등록된 문의가 없습니다.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact, index) => (
                <TableRow key={contact.id} className="hover:bg-gray-50">
                  <TableCell className="text-center text-muted-foreground">
                    {contacts.length - index}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p
                      className="truncate text-muted-foreground"
                      title={contact.message}
                    >
                      {contact.message}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(contact.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {contact.admin_reply ? (
                      <Badge className="bg-brand hover:bg-brand/90">완료</Badge>
                    ) : (
                      <Badge variant="outline">미답변</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(contact.created_at) || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 font-anyvid"
                      onClick={() => openDetail(contact)}
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

      {/* 문의 상세 / 답변 다이얼로그 */}
      <Dialog
        open={!!selectedContact}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-paperlogy">문의 상세</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 font-anyvid">
              <div>
                <p className="text-sm text-muted-foreground mb-1">문의일</p>
                <p className="text-sm">
                  {formatDate(selectedContact.created_at) || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">문의 내용</p>
                <p className="text-sm whitespace-pre-wrap rounded-md border bg-muted/30 p-3">
                  {selectedContact.message}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">상태</p>
                <Select
                  value={editStatus}
                  onValueChange={(v) => setEditStatus(v as Contact["status"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">대기</SelectItem>
                    <SelectItem value="in_progress">처리 중</SelectItem>
                    <SelectItem value="resolved">완료</SelectItem>
                    <SelectItem value="closed">종료</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  관리자 답변
                </p>
                <Textarea
                  placeholder="답변을 입력하세요"
                  rows={5}
                  value={editReply}
                  onChange={(e) => setEditReply(e.target.value)}
                  className="resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedContact(null)}
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

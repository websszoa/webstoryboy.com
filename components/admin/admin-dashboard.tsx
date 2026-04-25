import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare } from "lucide-react";
import { Profile, Contact } from "@/lib/types";
import { formatDate, normalizeAvatarUrl } from "@/lib/utils";

interface AdminDashboardProps {
  members: Profile[];
  contacts: Contact[];
}

export default function AdminDashboard({
  members,
  contacts,
}: AdminDashboardProps) {
  // 회원 통계
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => !m.is_deleted).length;
  const deletedMembers = members.filter((m) => m.is_deleted).length;
  const adminMembers = members.filter((m) => m.role === "admin").length;

  // 문의 통계
  const totalContacts = contacts.length;
  const pendingContacts = contacts.filter((c) => c.status === "pending").length;
  const progressContacts = contacts.filter(
    (c) => c.status === "progress",
  ).length;
  const resolvedContacts = contacts.filter(
    (c) => c.status === "resolved",
  ).length;

  // 최근 5건
  const recentMembers = members.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold font-paperlogy">대시보드</h1>
        <p className="text-sm text-muted-foreground font-anyvid mt-1">
          회원, 문의사항 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 회원 */}
        <Card className="border rounded-lg overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm font-paperlogy text-muted-foreground">
                회원
              </span>
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-nanumNeo text-brand">
                {totalMembers}
              </span>
              <span className="text-sm text-muted-foreground font-anyvid">
                전체
              </span>
            </div>
            <div className="flex gap-4 text-sm font-anyvid">
              <span className="text-muted-foreground">
                활성{" "}
                <span className="font-medium text-green-600">
                  {activeMembers}
                </span>
                명
              </span>
              <span className="text-muted-foreground">
                탈퇴{" "}
                <span className="font-medium text-red-600">
                  {deletedMembers}
                </span>
                명
              </span>
              <span className="text-muted-foreground">
                관리자{" "}
                <span className="font-medium text-blue-600">
                  {adminMembers}
                </span>
                명
              </span>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full font-anyvid"
              asChild
            >
              <Link href="/admin/member">회원 관리 →</Link>
            </Button>
          </CardContent>
        </Card>

        {/* 문의사항 */}
        <Card className="border rounded-lg overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm font-paperlogy text-muted-foreground">
                문의사항
              </span>
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-nanumNeo text-brand">
                {totalContacts}
              </span>
              <span className="text-sm text-muted-foreground font-anyvid">
                전체
              </span>
            </div>
            <div className="flex gap-4 text-sm font-anyvid">
              <span className="text-muted-foreground">
                대기중{" "}
                <span className="font-medium text-red-600">
                  {pendingContacts}
                </span>
                건
              </span>
              <span className="text-muted-foreground">
                처리중{" "}
                <span className="font-medium text-yellow-600">
                  {progressContacts}
                </span>
                건
              </span>
              <span className="text-muted-foreground">
                해결됨{" "}
                <span className="font-medium text-green-600">
                  {resolvedContacts}
                </span>
                건
              </span>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full font-anyvid"
              asChild
            >
              <Link href="/admin/contact">문의 관리 →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 최근 가입 회원 */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gray-50 flex items-center justify-between px-4 py-2 border-b">
            <h2 className="font-paperlogy">최근 가입 회원</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/admin/member"
                className="text-xs font-anyvid text-muted-foreground"
              >
                전체 보기 →
              </Link>
            </Button>
          </div>
          <div className="divide-y">
            {recentMembers.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground font-anyvid">
                등록된 회원이 없습니다.
              </p>
            ) : (
              recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={normalizeAvatarUrl(member.avatar_url)}
                      alt={member.full_name || "프로필"}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate font-anyvid">
                      {member.full_name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate font-anyvid">
                      {member.email || "-"}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {member.role === "admin" ? (
                      <Badge variant="destructive" className="text-xs">
                        관리자
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        회원
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground font-anyvid">
                      {formatDate(member.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 최근 문의 */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gray-50 flex items-center justify-between px-4 py-2 border-b">
            <h2 className="font-paperlogy">최근 문의</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/admin/contact"
                className="text-xs font-anyvid text-muted-foreground"
              >
                전체 보기 →
              </Link>
            </Button>
          </div>
          <div className="divide-y">
            {recentContacts.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground font-anyvid">
                등록된 문의가 없습니다.
              </p>
            ) : (
              recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground truncate font-anyvid">
                      {contact.message}
                    </p>
                    <p className="text-xs text-muted-foreground font-anyvid">
                      {contact.user_email}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {contact.status === "pending" && (
                      <Badge variant="destructive" className="text-xs">
                        대기중
                      </Badge>
                    )}
                    {contact.status === "progress" && (
                      <Badge variant="outline" className="text-xs">
                        처리중
                      </Badge>
                    )}
                    {contact.status === "resolved" && (
                      <Badge variant="outline" className="text-xs">
                        해결됨
                      </Badge>
                    )}
                    {contact.status === "closed" && (
                      <Badge variant="outline" className="text-xs">
                        종료됨
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground font-anyvid">
                      {formatDate(contact.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

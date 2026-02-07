"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cable, Gamepad2, MessageSquare, Users } from "lucide-react";

export interface DashboardStats {
  membersCount: number;
  contactsCount: number;
  contactsPendingCount: number;
}

interface AdminDashboardProps {
  stats: DashboardStats;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="md:p-6 md:space-y-8 p-4 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
          대시보드
        </h1>
        <p className="text-sm text-muted-foreground font-anyvid mt-1">
          관리자 메인 화면입니다. 회원과 문의 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand/10 p-3">
              <Users className="w-6 h-6 text-brand" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-paperlogy">
                전체 회원
              </p>
              <p className="text-2xl font-semibold font-paperlogy">
                {stats.membersCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-paperlogy">
                전체 문의
              </p>
              <p className="text-2xl font-semibold font-paperlogy">
                {stats.contactsCount}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-lg p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-3">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-paperlogy">
                대기 문의
              </p>
              <p className="text-2xl font-semibold font-paperlogy text-amber-600">
                {stats.contactsPendingCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 메뉴 */}
      <div>
        <h2 className="text-lg font-semibold font-paperlogy mb-4">빠른 메뉴</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto flex flex-col items-start gap-2 p-5 font-anyvid hover:bg-brand/5 hover:border-brand/50"
            asChild
          >
            <Link href="/admin/member">
              <div className="flex items-center gap-2">
                <Cable className="w-5 h-5" />
                <span className="font-semibold">회원 관리</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                전체 회원 목록을 확인하고 관리합니다.
              </p>
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex flex-col items-start gap-2 p-5 font-anyvid hover:bg-brand/5 hover:border-brand/50"
            asChild
          >
            <Link href="/admin/contact">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                <span className="font-semibold">문의 관리</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                사용자 문의를 확인하고 답변합니다.
              </p>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

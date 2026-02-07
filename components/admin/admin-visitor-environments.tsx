"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { VisitorEnvironment } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { RefreshCw, Globe, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminVisitorEnvironmentsProps {
  initialVisitors: VisitorEnvironment[];
}

export default function AdminVisitorEnvironments({
  initialVisitors,
}: AdminVisitorEnvironmentsProps) {
  const router = useRouter();
  const [visitors] = useState<VisitorEnvironment[]>(initialVisitors);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    router.refresh();
    setTimeout(() => setIsLoading(false), 500);
  };

  const total = visitors.length;
  const byCountry = visitors.reduce<Record<string, number>>((acc, v) => {
    const key = v.country_code || v.country_name || "-";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const byDevice = visitors.reduce<Record<string, number>>((acc, v) => {
    const key = v.device_type || "-";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="md:p-6 md:space-y-6 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-paperlogy flex items-center gap-2">
            <Globe className="w-7 h-7" />
            방문자 환경
          </h1>
          <p className="text-sm text-muted-foreground font-anyvid mt-1">
            국가, 지역, 디바이스·브라우저·OS 등 방문 환경을 확인할 수 있습니다.
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

      {/* 간단 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            총 기록 수
          </p>
          <p className="text-2xl font-semibold font-paperlogy">{total}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            국가/지역 수
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-brand">
            {Object.keys(byCountry).length}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">모바일</p>
          <p className="text-2xl font-semibold font-paperlogy text-green-600">
            {byDevice["mobile"] ?? 0}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-paperlogy">
            데스크톱
          </p>
          <p className="text-2xl font-semibold font-paperlogy text-blue-600">
            {byDevice["desktop"] ?? 0}
          </p>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white border rounded-lg overflow-hidden font-anyvid">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead className="w-[120px]">IP 주소</TableHead>
              <TableHead className="">국가</TableHead>
              <TableHead className="">지역/도시</TableHead>
              <TableHead className="text-center">디바이스</TableHead>
              <TableHead className="">브라우저</TableHead>
              <TableHead className="">OS</TableHead>
              <TableHead className="">언어</TableHead>
              <TableHead className="">유입</TableHead>
              <TableHead className="">기록일시</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">
                      로딩 중...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : visitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <BarChart3 className="w-8 h-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      수집된 방문자 환경이 없습니다.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              visitors.map((v, index) => (
                <TableRow key={v.id} className="hover:bg-gray-50">
                  <TableCell className="text-center text-muted-foreground">
                    {visitors.length - index}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {v.ip_address || "-"}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {v.country_name || v.country_code || "-"}
                    </span>
                    {v.country_code && (
                      <span className="text-muted-foreground text-xs ml-1">
                        ({v.country_code})
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {[v.region, v.city].filter(Boolean).join(" / ") || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {v.device_type === "mobile"
                      ? "모바일"
                      : v.device_type === "tablet"
                        ? "태블릿"
                        : v.device_type || "-"}
                  </TableCell>
                  <TableCell>
                    {v.browser}
                    {v.browser_version ? ` ${v.browser_version}` : ""}
                    {!v.browser && "-"}
                  </TableCell>
                  <TableCell>
                    {v.os}
                    {v.os_version ? ` ${v.os_version}` : ""}
                    {!v.os && "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {v.language || "-"}
                  </TableCell>
                  <TableCell
                    className="text-muted-foreground max-w-[120px] truncate"
                    title={v.referrer_domain ?? ""}
                  >
                    {v.referrer_domain || "직접"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(v.created_at)}
                    {v.created_at && v.created_at.length > 10
                      ? ` ${v.created_at.slice(11, 16)}`
                      : ""}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

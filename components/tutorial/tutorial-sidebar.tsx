"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TreeNode } from "@/lib/tutorial/tree";
import { cn } from "@/lib/utils";

interface TutorialSidebarProps {
  tree: TreeNode[];
  /** 현재 보고 있는 튜토리얼(예: eventzoa, runzoa). 이 항목만 왼쪽에 표시됩니다. */
  currentSegment: string | null;
}

const LABEL_MAP: Record<string, string> = {
  introduction: "소개",
  installation: "설치",
  environment: "개발 환경",
};

function formatLabel(name: string): string {
  return (
    LABEL_MAP[name.toLowerCase()] ??
    name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

function NavNode({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const pathname = usePathname();
  const href = node.path ? `/tutorial/${node.path}` : undefined;
  const isActive = href ? pathname === href : false;
  const hasChildren = node.children && node.children.length > 0;

  if (hasChildren) {
    return (
      <div className="mb-1">
        <div
          className={cn(
            "font-nanumNeo py-1.5 text-sm font-medium text-foreground",
            depth === 0 && "uppercase tracking-wider text-muted-foreground",
          )}
        >
          {formatLabel(node.name)}
        </div>
        <ul className="ml-2 border-l border-border pl-3">
          {node.children!.map((child) => (
            <li key={child.name + (child.path ?? "")}>
              <NavNode node={child} depth={depth + 1} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Link
      href={href ?? "#"}
      className={cn(
        "font-anyvid block py-1.5 text-sm transition-colors",
        isActive
          ? "font-medium text-brand"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {formatLabel(node.name)}
    </Link>
  );
}

export default function TutorialSidebar({
  tree,
  currentSegment,
}: TutorialSidebarProps) {
  // 현재 세그먼트에 해당하는 노드만 표시 (eventzoa / runzoa 등 따로 분리)
  const currentTree =
    currentSegment != null
      ? tree.filter((node) => node.name === currentSegment)
      : tree;

  return (
    <aside className="w-full shrink-0 md:w-56 lg:w-64">
      <nav className="sticky top-6 space-y-4">
        {/* 다른 튜토리얼로 전환 */}
        {tree.length > 1 && (
          <div className="mb-4 space-y-2">
            <span className="font-paperlogy text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              튜토리얼 선택
            </span>
            <ul className="flex flex-wrap gap-2">
              {tree.map((node) => {
                const firstPath = node.path ?? node.children?.[0]?.path;
                const href = firstPath ? `/tutorial/${firstPath}` : "#";
                const isCurrent = node.name === currentSegment;
                return (
                  <li key={node.name}>
                    <Link
                      href={href}
                      className={cn(
                        "font-anyvid rounded-md border px-2.5 py-1.5 text-sm transition-colors",
                        isCurrent
                          ? "border-brand bg-brand/10 text-brand"
                          : "border-border text-muted-foreground hover:border-brand/50 hover:text-foreground",
                      )}
                    >
                      {formatLabel(node.name)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <span className="font-paperlogy text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {currentSegment ? formatLabel(currentSegment) : "Tutorial"}
        </span>
        <ul className="space-y-1">
          {currentTree.map((node) => (
            <li key={node.name}>
              <NavNode node={node} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

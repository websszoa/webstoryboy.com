"use client";

import Image from "next/image";
import { useState } from "react";
import {
  MessageCircle,
  Paperclip,
  Download,
  ChevronDown,
  ChevronUp,
  Plus,
  FileText,
  HelpCircle,
  Share2,
  X,
  LayoutList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { courseTitles, type CourseId } from "@/lib/tutorial/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PostType = "question" | "share" | "resource";
type FilterType = "all" | PostType;

interface Reply {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
}

interface Post {
  id: number;
  type: PostType;
  title: string;
  content: string;
  author: string;
  avatar: string;
  date: string;
  replies: Reply[];
  file?: { name: string; size: string };
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    type: "question",
    title: "Supabase RLS 정책 설정할 때 insert는 되는데 select가 안 됩니다",
    content:
      "profiles 테이블에 RLS를 활성화했는데, 본인 데이터 조회가 계속 빈 배열로 옵니다. auth.uid() = id 조건으로 select 정책을 만들었는데 뭐가 문제일까요?",
    author: "달리는개발자",
    avatar: "/face/face03.webp",
    date: "2026.04.20",
    replies: [
      {
        id: 1,
        author: "webstoryboy",
        avatar: "/face/face01.webp",
        content:
          "anon 키 대신 service_role 키로 테스트해보셨나요? 클라이언트에서는 anon 키를 써야 RLS가 제대로 작동합니다. createClient 설정을 한 번 확인해보세요.",
        date: "2026.04.20",
      },
      {
        id: 2,
        author: "달리는개발자",
        avatar: "/face/face03.webp",
        content:
          "아 맞다! service_role로 테스트하고 있었네요. 해결됐습니다 감사합니다!",
        date: "2026.04.21",
      },
    ],
  },
  {
    id: 2,
    type: "resource",
    title: "Tailwind CSS 치트시트 PDF (자주 쓰는 클래스 모음)",
    content:
      "강의 보면서 자주 쓰는 Tailwind 클래스들을 정리한 PDF입니다. flex, grid, spacing, typography 위주로 묶었어요. 도움이 되셨으면 합니다.",
    author: "픽셀장인",
    avatar: "/face/face05.webp",
    date: "2026.04.18",
    replies: [
      {
        id: 1,
        author: "코드새싹",
        avatar: "/face/face07.webp",
        content: "정말 유용한 자료네요! 감사합니다 😊",
        date: "2026.04.19",
      },
    ],
    file: { name: "tailwind-cheatsheet.pdf", size: "1.2MB" },
  },
  {
    id: 3,
    type: "share",
    title: "Next.js 15 app router에서 middleware 적용하는 방법 공유",
    content:
      "Supabase 인증과 Next.js middleware를 함께 쓰는 방법이 15 버전에서 살짝 바뀌었더라고요. createServerClient 설정이 핵심이었습니다. 삽질한 내용 공유합니다.",
    author: "풀스택러너",
    avatar: "/face/face09.webp",
    date: "2026.04.15",
    replies: [],
  },
  {
    id: 4,
    type: "question",
    title: "vercel 배포 후 환경변수가 적용이 안 되는 것 같아요",
    content:
      "로컬에서는 잘 되는데 vercel에 올리면 NEXT_PUBLIC_ 변수가 undefined로 뜹니다. .env.local은 당연히 git에 안 올렸고, vercel 환경변수 설정에는 넣었는데 왜 그럴까요?",
    author: "배포초보",
    avatar: "/face/face02.webp",
    date: "2026.04.12",
    replies: [
      {
        id: 1,
        author: "webstoryboy",
        avatar: "/face/face01.webp",
        content:
          "환경변수 추가 후 반드시 재배포(Redeploy)를 해야 적용됩니다. Vercel 대시보드에서 Deployments 탭 → 최신 배포 → Redeploy 버튼을 눌러보세요.",
        date: "2026.04.12",
      },
    ],
  },
];

const TYPE_CONFIG: Record<
  PostType,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  question: {
    label: "질문",
    icon: HelpCircle,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  resource: {
    label: "자료",
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  share: {
    label: "공유",
    icon: Share2,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
};

const FILTERS: { value: FilterType; label: string; icon: React.ElementType }[] =
  [
    { value: "all", label: "전체", icon: LayoutList },
    { value: "question", label: "질문", icon: HelpCircle },
    { value: "share", label: "공유", icon: Share2 },
    { value: "resource", label: "자료", icon: FileText },
  ];

function TypeBadge({ type }: { type: PostType }) {
  const { label, icon: Icon, color, bg } = TYPE_CONFIG[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-anyvid",
        bg,
        color,
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function PostCard({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-card transition-shadow hover:shadow-md hover:border-red-500">
      <button
        className="w-full text-left px-5 py-4"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <TypeBadge type={post.type} />
              {post.file && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Paperclip className="w-3 h-3" />
                  첨부파일
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground dark:text-white leading-snug font-anyvid">
              {post.title}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.replies.length}
            </span>
            {open ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-7 h-7 rounded-full overflow-hidden bg-muted shrink-0">
            <Image
              src={post.avatar}
              alt={post.author}
              width={30}
              height={30}
              className="w-full h-full object-cover border border-red-500/50 rounded-full"
            />
          </div>
          <span className="text-xs text-muted-foreground font-anyvid">
            {post.author}
          </span>
          <span className="text-xs text-muted-foreground font-anyvid">
            {post.date}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-border">
          <div className="px-5 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed font-anyvid whitespace-pre-wrap">
              {post.content}
            </p>
            {post.file && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm hover:bg-muted transition-colors cursor-pointer group">
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900 dark:text-white truncate font-anyvid">
                    {post.file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {post.file.size}
                  </p>
                </div>
                <Download className="w-3.5 h-3.5 text-muted-foreground group-hover:text-slate-900 dark:group-hover:text-white transition-colors ml-1" />
              </div>
            )}
          </div>

          {post.replies.length > 0 && (
            <div className="border-t border-border bg-muted/20 dark:bg-white/[0.02]">
              <button
                className="w-full flex items-center justify-between px-5 py-3 text-xs text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors font-anyvid"
                onClick={() => setReplyOpen(!replyOpen)}
              >
                <span>답변 {post.replies.length}개</span>
                {replyOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              {replyOpen && (
                <div className="divide-y divide-border">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="px-5 py-3 flex gap-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-muted shrink-0 mt-0.5">
                        <Image
                          src={reply.avatar}
                          alt={reply.author}
                          width={30}
                          height={30}
                          className="w-full h-full object-cover border border-red-500/50 rounded-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-slate-900 dark:text-white font-anyvid">
                            {reply.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {reply.date}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed font-anyvid">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="px-5 py-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-red-600 font-anyvid gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              답변 작성
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function WriteForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<PostType>("question");

  return (
    <div className="border border-red-200 dark:border-red-900/50 rounded-xl bg-card overflow-hidden mb-5">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-red-50/50 dark:bg-red-950/10">
        <p className="text-sm text-slate-900 dark:text-white font-anyvid">
          글 작성
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 text-muted-foreground hover:text-slate-900 hover:bg-red-100 dark:hover:bg-red-900/50 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          {(["question", "share", "resource"] as PostType[]).map((t) => {
            const { label, icon: Icon, color } = TYPE_CONFIG[t];
            return (
              <Button
                key={t}
                variant="outline"
                size="sm"
                onClick={() => setType(t)}
                className={cn(
                  "rounded-full text-xs font-anyvid h-7 px-3 gap-1.5 transition-all",
                  type === t
                    ? cn("border-current font-medium", color)
                    : "text-muted-foreground hover:border-gray-400",
                )}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Button>
            );
          })}
        </div>
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          className="font-anyvid focus-visible:ring-red-400"
        />
        <Textarea
          placeholder="내용을 입력하세요. 코드는 ``` 로 감싸면 보기 좋게 표시됩니다."
          rows={5}
          className="font-anyvid resize-none focus-visible:ring-red-400 min-h-[150px]"
        />
        <div className="border border-dashed border-border rounded-lg px-4 py-3 flex items-center gap-3 hover:border-gray-400 transition-colors cursor-pointer group">
          <Paperclip className="w-4 h-4 text-muted-foreground group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
          <div>
            <p className="text-sm text-muted-foreground font-anyvid">
              파일 첨부 (선택)
            </p>
            <p className="text-[10px] text-muted-foreground/60 font-anyvid">
              PDF, ZIP, 이미지 등 · 최대 10MB
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-1 pt-1">
          <Button
            variant="outline"
            onClick={onClose}
            className="font-anyvid text-xs"
          >
            취소
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white font-anyvid text-xs">
            등록
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── 오른쪽 패널 (TOC 자리) ── */
function DiscussionPanel({
  filter,
  setFilter,
  onWrite,
  counts,
}: {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  onWrite: () => void;
  counts: Record<FilterType, number>;
}) {
  return (
    <aside className="w-50 shrink-0 hidden lg:block" aria-label="토론방 필터">
      <div className="sticky top-6 flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          필터
        </h3>
        <ul className="space-y-2 border-l border-gray-200 dark:border-white/10">
          {FILTERS.map(({ value, label, icon: Icon }) => (
            <li key={value}>
              <button
                onClick={() => setFilter(value)}
                className={cn(
                  "w-full flex items-center justify-between py-0.5 pl-3 pr-1 border-l-2 -ml-px transition-colors text-sm font-anyvid",
                  filter === value
                    ? "border-red-500 text-red-600 dark:text-dark-brand dark:border-dark-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-400",
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                </span>
                <span className="text-[11px] text-muted-foreground/60 font-poppins">
                  {counts[value]}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <Button
          onClick={onWrite}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-anyvid text-xs mt-1 gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          글쓰기
        </Button>
      </div>
    </aside>
  );
}

/* ── 메인 컴포넌트 ── */
export default function TutorialDiscussion({ course }: { course: CourseId }) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [writing, setWriting] = useState(false);

  const filtered =
    filter === "all" ? MOCK_POSTS : MOCK_POSTS.filter((p) => p.type === filter);

  const counts: Record<FilterType, number> = {
    all: MOCK_POSTS.length,
    question: MOCK_POSTS.filter((p) => p.type === "question").length,
    share: MOCK_POSTS.filter((p) => p.type === "share").length,
    resource: MOCK_POSTS.filter((p) => p.type === "resource").length,
  };

  return (
    <div className="flex gap-8 p-4 md:p-6 px-8 lg:px-10 lg:pr-0">
      {/* 가운데: 포스트 목록 */}
      <div className="min-w-0 flex-1 py-0">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-paperlogy text-slate-900 dark:text-white mt-1">
            {courseTitles[course]} 토론방
          </h1>
          <p className="text-sm text-muted-foreground font-anyvid mt-1">
            질문하고, 답하고, 자료를 나눠요. 함께 배우면 더 빠릅니다.
          </p>
        </div>

        {/* 모바일 글쓰기 버튼 */}
        <div className="flex justify-end mb-4 lg:hidden">
          <Button
            onClick={() => setWriting(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-anyvid text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            글쓰기
          </Button>
        </div>

        {/* 글쓰기 폼 */}
        {writing && <WriteForm onClose={() => setWriting(false)} />}

        {/* 포스트 목록 */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground font-anyvid text-sm">
              아직 글이 없습니다. 첫 번째로 질문하거나 자료를 공유해보세요!
            </div>
          ) : (
            filtered.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>

      {/* 오른쪽: 필터 패널 */}
      <DiscussionPanel
        filter={filter}
        setFilter={setFilter}
        onWrite={() => setWriting(true)}
        counts={counts}
      />
    </div>
  );
}

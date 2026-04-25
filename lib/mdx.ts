import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import GitHubSlugger from "github-slugger";
import type { CourseId } from "@/lib/tutorial/config";

const CONTENT_DIR = path.join(process.cwd(), "content", "tutorial");

export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

/** RSC용: raw 소스 + frontmatter + 목차 (클라이언트 직렬화 없음) */
export interface MdxDoc {
  raw: string;
  frontmatter: Record<string, unknown>;
  toc: TocItem[];
}

/** next-mdx-remote/rsc 의 MDXRemote options */
export const mdxRemoteOptions = {
  parseFrontmatter: true,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeHighlight],
  },
};

/**
 * 코스·슬러그에 해당하는 MDX 파일 경로
 */
function getMdxPath(course: CourseId, slug: string): string {
  return path.join(CONTENT_DIR, course, `${slug}.mdx`);
}

/**
 * 마크다운/MDX 소스에서 h2, h3 목차 추출 (rehype-slug와 동일한 id 생성)
 */
export function extractHeadings(source: string): TocItem[] {
  const slugger = new GitHubSlugger();
  const headings: TocItem[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(source)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    const id = slugger.slug(text);
    headings.push({ depth, text, id });
  }
  return headings;
}

/**
 * 코스·슬러그에 해당하는 MDX 파일 로드 (raw + 목차). RSC에서 MDXRemote에 raw 전달용.
 */
export async function loadMdx(course: CourseId, slug: string): Promise<MdxDoc | null> {
  const filePath = getMdxPath(course, slug);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data: frontmatter } = matter(raw);
  const toc = extractHeadings(content);

  return {
    raw,
    frontmatter: frontmatter as Record<string, unknown>,
    toc,
  };
}

/**
 * 해당 코스의 모든 MDX 슬러그 목록 (파일 시스템 기준)
 */
export function getMdxSlugs(course: CourseId): string[] {
  const dir = path.join(CONTENT_DIR, course);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

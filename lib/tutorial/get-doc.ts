import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getHeadings, type TocItem } from "./headings";

const CONTENT_DIR = path.join(process.cwd(), "content", "tutorial");

export interface DocResult {
  content: string;
  raw: string;
  frontmatter: { title?: string; description?: string; [key: string]: unknown };
  headings: TocItem[];
}

/**
 * slug 배열으로 MDX 파일을 읽고, frontmatter와 본문, 제목 목록을 반환합니다.
 */
export function getDoc(slugSegments: string[]): DocResult | null {
  const filePath = path.join(CONTENT_DIR, ...slugSegments) + ".mdx";
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);
  const headings = getHeadings(content);
  return {
    content,
    raw,
    frontmatter: data as DocResult["frontmatter"],
    headings,
  };
}

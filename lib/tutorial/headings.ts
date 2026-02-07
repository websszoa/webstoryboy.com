import GitHubSlugger from "github-slugger";

/**
 * MDX 소스에서 h2, h3 제목을 추출해 오른쪽 TOC용으로 반환합니다.
 * rehype-slug와 동일한 id를 쓰기 위해 github-slugger 사용.
 */
export interface TocItem {
  id: string;
  text: string;
  depth: number; // 2 = h2, 3 = h3
}

export function getHeadings(source: string): TocItem[] {
  const slugger = new GitHubSlugger();
  const headings: TocItem[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(source)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    headings.push({ id: slugger.slug(text), text, depth });
  }
  return headings;
}

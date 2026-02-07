import GitHubSlugger from "github-slugger";
import type { Root } from "hast";
import { visit } from "unist-util-visit";

/**
 * h2, h3에 id를 부여해 TOC 앵커와 일치시킵니다. (headings.ts의 getHeadings와 동일한 id 생성)
 */
export function rehypeHeadingId() {
  const slugger = new GitHubSlugger();
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (["h2", "h3"].includes(node.tagName)) {
        const text = node.children
          .filter((c) => c.type === "text")
          .map((c) => (c as { value: string }).value)
          .join("");
        if (text) {
          node.properties = node.properties ?? {};
          (node.properties as Record<string, string>).id = slugger.slug(text);
        }
      }
    });
  };
}

import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "tutorial");

export interface TreeNode {
  name: string;
  path?: string;
  children?: TreeNode[];
}

function listMdxFiles(dir: string, base = ""): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const slugs: string[] = [];
  for (const ent of entries) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) {
      slugs.push(...listMdxFiles(path.join(dir, ent.name), rel));
    } else if (ent.isFile() && ent.name.endsWith(".mdx")) {
      slugs.push(rel.replace(/\.mdx$/, ""));
    }
  }
  return slugs;
}

function slugsToTree(slugs: string[], prefix = ""): TreeNode[] {
  const byFirst: Record<string, string[]> = {};
  for (const slug of slugs) {
    const parts = slug.split("/");
    const first = parts[0];
    const rest = parts.slice(1).join("/");
    if (!byFirst[first]) byFirst[first] = [];
    if (rest) byFirst[first].push(rest);
    else byFirst[first].push("");
  }
  return Object.entries(byFirst).map(([name, rest]) => {
    const fullPath = prefix ? `${prefix}/${name}` : name;
    const hasLeaf = rest.includes("");
    const nested = rest.filter(Boolean);
    if (nested.length === 0) {
      return { name, path: hasLeaf ? fullPath : undefined };
    }
    const children = slugsToTree([...new Set(nested)], fullPath);
    return { name, children };
  });
}

export function getTutorialTree(): TreeNode[] {
  const slugs = listMdxFiles(CONTENT_DIR);
  if (slugs.length === 0) return [];
  return slugsToTree(slugs);
}

export function getAllTutorialSlugs(): string[][] {
  const slugs = listMdxFiles(CONTENT_DIR);
  return slugs.map((s) => s.split("/"));
}

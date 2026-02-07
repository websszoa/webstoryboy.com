import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { APP_NAME, APP_SITE_URL } from "@/lib/constants";
import { getDoc } from "@/lib/tutorial/get-doc";
import {
  getTutorialTree,
  getAllTutorialSlugs,
  type TreeNode,
} from "@/lib/tutorial/tree";
import TutorialSidebar from "@/components/tutorial/tutorial-sidebar";
import TutorialToc from "@/components/tutorial/tutorial-toc";

export async function generateStaticParams() {
  const slugs = getAllTutorialSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return {
      title: `튜토리얼 | ${APP_NAME}`,
      description: `${APP_NAME} 튜토리얼 목록입니다.`,
    };
  }

  const doc = getDoc(slug);
  if (!doc) {
    return { title: `튜토리얼 | ${APP_NAME}` };
  }

  const title = (doc.frontmatter.title as string) ?? slug[slug.length - 1];
  const description = (doc.frontmatter.description as string) ?? undefined;
  const keywords = doc.frontmatter.keywords as string | string[] | undefined;
  const image = doc.frontmatter.image as string | undefined;
  const canonicalPath = `/tutorial/${slug.join("/")}`;
  const pageTitle = `${title} | 튜토리얼 | ${APP_NAME}`;
  const pageDescription = description ?? `${APP_NAME} 튜토리얼 - ${title}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${APP_SITE_URL}${canonicalPath}`,
      type: "article",
      ...(image && {
        images: [
          { url: image.startsWith("http") ? image : `${APP_SITE_URL}${image}` },
        ],
      }),
    },
    alternates: {
      canonical: `${APP_SITE_URL}${canonicalPath}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function collectPaths(node: TreeNode): string[] {
  if (node.path) return [node.path];
  if (node.children) return node.children.flatMap(collectPaths);
  return [];
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const tree = getTutorialTree();

  if (!slug || slug.length === 0) {
    const paths = tree.flatMap(collectPaths);
    const firstPath = paths[0];
    if (firstPath) redirect(`/tutorial/${firstPath}`);
    return (
      <div className="flex w-full gap-8 px-4 py-8 md:px-6 lg:px-8">
        <TutorialSidebar tree={tree} currentSegment={slug?.[0] ?? null} />
        <div className="min-w-0 flex-1 font-anyvid text-muted-foreground">
          튜토리얼 문서가 없습니다. content/tutorial 아래에 .mdx 파일을 추가해
          주세요.
        </div>
      </div>
    );
  }

  const doc = getDoc(slug);
  if (!doc) notFound();

  const { content, frontmatter, headings } = doc;

  const title = (frontmatter.title as string) ?? slug[slug.length - 1];
  const mdxOptions = {
    rehypePlugins: [rehypeSlug],
  };

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: { parseFrontmatter: true, mdxOptions },
  });

  return (
    <div className="flex w-full gap-8 px-4 py-8 md:px-6 lg:px-8">
      <TutorialSidebar tree={tree} currentSegment={slug[0] ?? null} />
      <article className="min-w-0 flex-1">
        <header className="mb-8">
          <h1 className="font-paperlogy text-2xl text-foreground md:text-3xl">
            {title}
          </h1>
          {frontmatter.description && (
            <p className="font-anyvid mt-2 text-muted-foreground">
              {frontmatter.description as string}
            </p>
          )}
        </header>
        <div className="font-anyvid prose prose-slate max-w-none text-[rgb(82,82,82)] prose-headings:font-paperlogy prose-headings:text-foreground prose-p:leading-relaxed">
          {mdxContent}
        </div>
      </article>
      <TutorialToc headings={headings} />
    </div>
  );
}

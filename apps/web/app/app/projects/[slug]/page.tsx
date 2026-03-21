import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailSurface } from "@/components/product-surfaces";
import { getProject } from "@/components/site-data";
import { ProductHeader } from "@/components/site-primitives";
import { createPrivatePageMetadata } from "../../../seo";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="site-shell pb-16" id="main-content">
      <ProductHeader />
      <ProjectDetailSurface project={project} />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return createPrivatePageMetadata({
      title: "Project",
      description: "A premium campaign workspace.",
      canonicalPath: `/app/projects/${slug}`,
    });
  }

  return createPrivatePageMetadata({
    title: project.name,
    description: project.brief,
    canonicalPath: `/app/projects/${project.slug}`,
  });
}

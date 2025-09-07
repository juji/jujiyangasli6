import { notFound } from "next/navigation";
import { works } from "@/data/works";
import workDetails from "@/data/works/details";
import { WorkPage as WorkPageChild } from "./work";

export function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `Work - ${params.slug}`,
    description: `Details about the work ${params.slug}`,
  };
}

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.id }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const content = workDetails[slug];
  const work = works.find((w) => w.id === slug);
  if (!work || !content) {
    return notFound();
  }

  return <WorkPageChild content={content} work={work} />;
}

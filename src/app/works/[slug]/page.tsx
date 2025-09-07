import { notFound } from "next/navigation";
import { works } from "@/data/works";
import workDetails from "@/data/works/details";
import { WorkPage as WorkPageChild } from "./work";

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps) {
  const { slug } = params;
  return {
    title: `Work - ${slug}`,
    description: `Details about the work ${slug}`,
  };
}

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.id }));
}

export default function WorkPage({ params }: PageProps) {
  const { slug } = params;
  const content = workDetails[slug];
  const work = works.find((w) => w.id === slug);
  if (!work || !content) {
    return notFound();
  }

  return <WorkPageChild content={content} work={work} />;
}

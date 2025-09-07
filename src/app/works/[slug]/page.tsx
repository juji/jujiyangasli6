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

export default function WorkPage({ params }: { params: { slug: string } }) {
  const content = workDetails[params.slug];
  const work = works.find((w) => w.id === params.slug);
  if (!work || !content) {
    return notFound();
  }

  return <WorkPageChild content={content} work={work} />;
}

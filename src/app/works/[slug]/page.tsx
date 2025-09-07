import { notFound } from "next/navigation";
import { works } from "@/data/works";
import workDetails from "@/data/works/details";
import { WorkPage as WorkPageChild } from "./work";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const work = works.find((w) => w.id === slug);
  return {
    title: `Juji - ${work ? work.title : "Work Not Found"}`,
    description: `View ${work ? work.title : "Work Not Found"} details.`,
  };
}

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.id }));
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

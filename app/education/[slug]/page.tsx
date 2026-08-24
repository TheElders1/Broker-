import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "@/components/ArticlePage";
import { EDUCATION_TOPICS, EDUCATION_ARTICLES } from "@/lib/data";

export function generateStaticParams() {
  return EDUCATION_TOPICS.map((topic) => ({ slug: topic.slug }));
}

function getTopic(slug: string) {
  const topic = EDUCATION_TOPICS.find((t) => t.slug === slug);
  const article = EDUCATION_ARTICLES[slug];
  if (!topic || !article) return null;
  return { topic, article };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getTopic(slug);
  if (!found) return {};
  return {
    title: found.topic.title,
    description: found.topic.description,
    alternates: { canonical: `/education/${slug}` },
  };
}

export default async function EducationArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getTopic(slug);
  if (!found) notFound();

  return (
    <ArticlePage
      eyebrow="Education"
      title={found.topic.title}
      intro={found.article.intro}
      sections={found.article.sections}
      backHref="/education"
      backLabel="Back to Education"
    />
  );
}

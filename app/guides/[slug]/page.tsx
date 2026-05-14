import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section, SectionHeader } from "@/components/ui/Section";
import { GuideCard } from "@/components/cards/GuideCard";
import { ConciergeCTA } from "@/components/sections/ConciergeCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { guidesMock } from "@/lib/mock";
import { guidesService } from "@/lib/services";
import { buildMetadata, SITE } from "@/lib/seo";

export function generateStaticParams() {
  return guidesMock.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await guidesService.getBySlug(slug);
  if (!res.ok || !res.data) return buildMetadata({ title: "Guide not found", description: "", path: `/guides/${slug}` });
  const g = res.data;
  return buildMetadata({
    title: g.title,
    description: g.excerpt,
    path: `/guides/${g.slug}`,
    image: g.image,
    keywords: [g.category, "TVV travel guide"],
  });
}

export const revalidate = 1800;

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guideRes = await guidesService.getBySlug(slug);
  if (!guideRes.ok || !guideRes.data) notFound();
  const guide = guideRes.data;

  const allRes = await guidesService.list();
  const all = allRes.ok ? allRes.data : [];
  const related = all.filter((g) => g.slug !== guide.slug && g.category === guide.category).slice(0, 3);
  const fallback = all.filter((g) => g.slug !== guide.slug).slice(0, 3);
  const moreReads = related.length > 0 ? related : fallback;

  return (
    <>
      <section className="bg-cream pt-10">
        <Container size="default">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
              { label: guide.category, href: `/guides?category=${guide.category.toLowerCase()}` },
              { label: guide.title },
            ]}
          />
          <article className="mt-10">
            <p className="text-label uppercase text-teal">{guide.category} · {guide.readTime} read</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] tracking-tight text-balance text-ink">
              {guide.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-secondary">{guide.excerpt}</p>
            <p className="mt-6 text-[13px] text-ink-muted">
              By {guide.author} ·{" "}
              {new Date(guide.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl">
              <Image src={guide.image} alt="" fill priority sizes="(min-width:1024px) 70vw, 100vw" className="object-cover" />
            </div>
          </article>
        </Container>
      </section>

      <Section tone="cream" pad="default">
        <Container size="narrow">
          <div className="prose-tvv space-y-5 text-[16px] leading-[1.85] text-ink-secondary">
            <p className="text-[18px] leading-[1.65] text-ink first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[56px] first-letter:font-bold first-letter:leading-[0.85] first-letter:text-teal">
              The first time I went to {guide.category.toLowerCase()}, I went the way most travellers go — with a
              top-ten list, a packed itinerary, and no real plan for the afternoon. This guide is the one I wish
              I'd had then.
            </p>
            <p>
              What follows is built from twelve trips, four monsoon seasons, and a small collection of arguments
              with hotel concierges. It is not exhaustive. It is the version of {guide.category} I'd give a
              friend, written the way I'd tell it to them over a long dinner.
            </p>

            <h2 className="mt-12 font-display text-[26px] leading-tight text-ink">First, when to go</h2>
            <p>
              Most guides will tell you the high season runs October through February, and they're right — sort of.
              The shoulder months are where the trip changes. By March, the light has softened. By May, the
              resorts are quieter and the prices reflect it. By the second week of October, the post-monsoon
              plankton bloom turns the water a colour you won't forget.
            </p>
            <p>
              The wrong question is "what's the best month." The right question is "what kind of trip do I want."
              Our specialists choose the week, not the month, and the difference shows.
            </p>

            <h2 className="mt-12 font-display text-[26px] leading-tight text-ink">Where to stay</h2>
            <p>
              Three properties matter more than the rest. The first is a boutique stay run by a family who
              still personally greet every guest. The second is a former government rest-house, converted with
              restraint and run by a small team. The third — and this is where we send most honeymooners — is a
              villa property that doesn't market itself online.
            </p>
            <p>You won't find these by searching. Ask your specialist.</p>

            <h2 className="mt-12 font-display text-[26px] leading-tight text-ink">A specialist's afternoon</h2>
            <p>
              Skip the obvious. Take a private boat at three p.m., go to the eastern side of the island, and
              swim where the locals swim. Eat where there is no menu. Watch the light fold over the water
              around six-fifteen. This is the part of the trip you'll talk about when you get home — not the
              checklist beach with the same photograph everyone takes.
            </p>

            <h2 className="mt-12 font-display text-[26px] leading-tight text-ink">In closing</h2>
            <p>
              The point of a destination is not to see it. The point is to notice it. The best trips we plan
              are the ones with room to do less — and the right specialist to make sure the less is the right less.
            </p>
            <p>Plan slowly. Travel well.</p>
          </div>

          <div className="mt-14 rounded-lg border border-line bg-white p-7">
            <p className="text-label uppercase text-teal">Ready to plan a journey like this?</p>
            <p className="mt-3 font-display text-[20px] leading-snug text-ink">
              The specialist who wrote this guide — and three others — designs trips like the one described above. Write to us.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex h-11 items-center justify-center rounded-md bg-teal px-6 text-[14px] font-medium text-white hover:bg-teal-hover">
                Plan my journey →
              </Link>
              <Link href="/guides" className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-white px-6 text-[14px] font-medium text-ink hover:border-ink">
                More guides
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white" pad="default">
        <Container>
          <SectionHeader eyebrow="Keep reading" title="More from the editorial desk." viewAllHref="/guides" viewAllLabel="All guides" />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {moreReads.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </Container>
      </Section>

      <ConciergeCTA />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.excerpt,
          image: guide.image,
          datePublished: guide.publishedAt,
          author: { "@type": "Person", name: guide.author },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            logo: { "@type": "ImageObject", url: `${SITE.url}/logo.svg` },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/guides/${guide.slug}` },
        }}
      />
    </>
  );
}

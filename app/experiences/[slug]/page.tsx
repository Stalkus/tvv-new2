import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PackageCard } from "@/components/cards/PackageCard";
import { ConciergeCTA } from "@/components/sections/ConciergeCTA";
import { CardRail, CardRailItem } from "@/components/sections/CardRail";
import { experiencesMock } from "@/lib/mock";
import { experiencesService, packagesService } from "@/lib/services";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return experiencesMock.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await experiencesService.getBySlug(slug);
  if (!res.ok || !res.data) return buildMetadata({ title: "Experience not found", description: "", path: `/experiences/${slug}` });
  const exp = res.data;
  return buildMetadata({
    title: `${exp.title} Journeys — Curated by TVV`,
    description: exp.description,
    path: `/experiences/${exp.slug}`,
    image: exp.image,
  });
}

export const revalidate = 600;

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const expRes = await experiencesService.getBySlug(slug);
  if (!expRes.ok || !expRes.data) notFound();
  const exp = expRes.data;

  const themeKey = exp.slug === "scuba-diving" ? "snorkelling" : exp.slug;
  const [themeRes, allRes] = await Promise.all([
    packagesService.byTheme(themeKey),
    packagesService.list({ limit: 6 }),
  ]);
  const tours = themeRes.ok && themeRes.data.length > 0
    ? themeRes.data
    : (allRes.ok ? allRes.data : []);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 -z-10">
          <Image src={exp.image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/65 to-navy/95" />
        </div>
        <Container>
          <div className="pt-8">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Experiences", href: "/experiences" },
                { label: exp.title },
              ]}
              invert
            />
          </div>
          <div className="max-w-2xl pb-16 pt-8 sm:pb-24 sm:pt-12">
            <p className="text-label uppercase text-gold">By experience</p>
            <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-tight tracking-tight text-balance">
              {exp.title}
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/75">{exp.description}</p>
          </div>
        </Container>
      </section>

      <Section tone="cream" pad="default">
        <Container>
          <SectionHeader
            eyebrow={`${exp.title} journeys`}
            title="Curated for the way you travel."
            description="A working shelf of routes that match this thread. Tell us your dates — we'll redraw any one of them around you."
          />
          <CardRail>
            {tours.map((t) => (
              <CardRailItem key={t.slug}>
                <PackageCard data={t} />
              </CardRailItem>
            ))}
          </CardRail>
        </Container>
      </Section>

      <ConciergeCTA />
    </>
  );
}

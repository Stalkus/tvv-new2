import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import type { Experience } from "@/lib/models";

interface TravelByExperienceProps {
  experiences: Experience[];
}

export function TravelByExperience({ experiences }: TravelByExperienceProps) {
  if (!experiences || experiences.length === 0) return null;
  return (
    <Section tone="white" pad="default">
      <Container>
        <SectionHeader
          eyebrow="Travel by experience"
          title="The way you travel, not the place you go."
          description="Pick a thread — honeymoon, adventure, slow wellness, food — and we'll route a journey around it."
          viewAllHref="/experiences"
          viewAllLabel="All experiences"
        />
        <div className="-mx-5 flex gap-5 overflow-x-auto scroll-rail px-5 pb-3 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
          {experiences.map((e) => (
            <div key={e.slug} className="w-[270px] shrink-0 sm:w-auto">
              <ExperienceCard experience={e} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

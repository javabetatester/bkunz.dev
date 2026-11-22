import { Elsewhere } from "~/components/home/Elsewhere";
import { Hero } from "~/components/home/Hero";
import { PinnedSection } from "~/components/home/PinnedSection";
import { Premises } from "~/components/home/Premises";
import { usePage } from "~/content/useCopy";

export default function Page() {
  const { copy } = usePage();
  return (
    <>
      <Hero />
      <div className="flex flex-col gap-14 pb-14 md:gap-24 md:pb-24">
        <Premises />
        {copy.sections.map((s, i) => (
          <PinnedSection key={s.id} section={s} side={i % 2 ? "end" : "start"} />
        ))}
        <Elsewhere />
      </div>
    </>
  );
}

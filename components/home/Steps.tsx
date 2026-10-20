import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sticker } from "@/components/ui/Sticker";
import { STEPS } from "@/lib/home-content";
import { cn } from "@/lib/utils";

export function Steps() {
  return (
    <section id="features" className="mx-auto max-w-[1200px] px-4 py-24 sm:px-5 lg:py-28">
      <Reveal>
        <SectionHeading className="mb-12">Live in three steps.</SectionHeading>
      </Reveal>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 120}>
            <article className={cn("lift flex h-full flex-col gap-4 rounded-3xl border-2 border-ink p-8", i === 2 ? "bg-lime" : "bg-white")}>
              <div className="flex items-center justify-between">
                <Sticker name={step.sticker} size={72} />
                <span className="font-display text-4xl text-ink/15">0{i + 1}</span>
              </div>
              <h3 className="text-2xl font-bold">{step.title}</h3>
              <p className="text-[17px] leading-relaxed text-body">{step.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQS } from "@/lib/home-content";

export function Faq() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-5 lg:pb-28">
      <Reveal>
        <SectionHeading size="md" className="mb-10">Questions, answered.</SectionHeading>
      </Reveal>
      <div className="flex flex-col gap-3.5">
        {FAQS.map((item, i) => (
          <Reveal key={item.q} delay={i * 80}>
            <details className="group rounded-2xl border-2 border-ink bg-white px-6 py-5 transition-shadow open:shadow-brutal">
              <summary className="flex list-none items-center justify-between gap-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink transition-transform duration-300 group-open:rotate-45 group-open:bg-lime" aria-hidden>
                  <svg viewBox="0 0 24 24" className="size-4">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 max-w-3xl leading-relaxed text-body">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

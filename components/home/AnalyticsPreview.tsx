"use client";

import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const BARS = [30, 45, 38, 62, 55, 80, 100];

export function AnalyticsPreview() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });

  return (
    <section id="analytics" className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 py-24 sm:px-5 lg:py-28">
      <div ref={ref} className="lift flex min-w-0 flex-[1_1_440px] flex-col gap-5 rounded-3xl border-2 border-ink bg-white p-6 sm:p-7">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Views", value: 12480 },
            { label: "Clicks", value: 3214 },
            { label: "CTR", value: 25.7, suffix: "%", decimals: 1 },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-sm text-muted">{stat.label}</div>
              <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} className="text-[clamp(22px,3vw,32px)] font-bold" />
            </div>
          ))}
        </div>
        <div className="relative h-44">
          <div className="absolute inset-0 flex items-end gap-2">
            {inView &&
              BARS.map((h, i) => (
                <div
                  key={i}
                  className={cn("animate-grow flex-1 rounded-t-lg", i === BARS.length - 1 ? "bg-ink" : "bg-[#E3EFC0]")}
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
          </div>
          {inView && (
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 size-full">
              <path
                d="M0 80 C 40 70, 60 50, 100 58 S 160 30, 200 36 S 260 10, 300 6"
                fill="none"
                stroke="#5B3DF5"
                strokeWidth="4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="animate-draw"
                style={{ animationDelay: ".5s", animationDuration: "2s" }}
              />
            </svg>
          )}
        </div>
        <span className="text-[13px] text-muted">Sample dashboard</span>
      </div>

      <Reveal className="flex min-w-0 flex-[1_1_400px] flex-col gap-5">
        <SectionHeading>Know what&apos;s working.</SectionHeading>
        <p className="text-lg leading-relaxed text-body">
          Track views, clicks per link, top countries and referrers. Your total view count shows publicly on your page as social proof.
        </p>
      </Reveal>
    </section>
  );
}

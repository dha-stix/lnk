import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CREATORS } from "@/lib/home-content";

export function Creators() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-5 lg:pb-28">
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading className="max-w-[660px]">Made for every kind of creator.</SectionHeading>
        <p className="max-w-[360px] text-lg leading-relaxed text-body">
          Hover a card. Every page is one tap from a bio, a story or a QR code.
        </p>
      </Reveal>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-6">
        {CREATORS.map((c, i) => (
          <Reveal key={c.handle} delay={i * 100}>
            <article
              className="lift flex min-h-[290px] flex-col gap-3 rounded-[26px] border-2 border-ink p-6 transition-transform hover:!rotate-0"
              style={{ background: c.bg, color: c.fg, rotate: c.tilt }}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-[52px] place-items-center rounded-full border-2 border-ink bg-white font-display text-xl text-ink">{c.initials}</span>
                <div>
                  <div className="text-lg font-bold">@{c.handle}</div>
                  <div className="text-sm opacity-85">{c.role}</div>
                </div>
              </div>
              <ul className="mt-auto flex flex-col gap-2">
                {c.links.map((link) => (
                  <li key={link.title} className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-sm font-semibold text-white">
                    <PlatformIcon platform={link.platform} size={18} />
                    <span className="flex-1 text-center">{link.title}</span>
                    <span className="w-[18px]" aria-hidden />
                  </li>
                ))}
              </ul>
              <span className="text-[13px] font-semibold opacity-85">{c.views} views this week</span>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { PlatformIcon, PlatformTile } from "@/components/ui/PlatformIcon";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { ORBIT_INNER, ORBIT_OUTER } from "@/lib/home-content";
import { getPlatform, PLATFORM_LIST, type PlatformKey } from "@/lib/platforms";
import { readableOn } from "@/lib/utils";

const ALL = [...ORBIT_INNER, ...ORBIT_OUTER];

type RingProps = {
  keys: PlatformKey[];
  radius: number;
  tile: number;
  duration: number;
  reverse?: boolean;
  selected: PlatformKey;
  onPick: (key: PlatformKey) => void;
};

function Ring({ keys, radius, tile, duration, reverse, selected, onPick }: RingProps) {
  const style = { "--dur": `${duration}s`, "--dir": reverse ? "reverse" : "normal", "--counter": reverse ? "normal" : "reverse" } as CSSProperties;
  return (
    <div className="orbit-ring absolute inset-0" style={style}>
      {keys.map((key, i) => {
        const angle = (i / keys.length) * Math.PI * 2 - Math.PI / 2;
        const platform = getPlatform(key)!;
        const active = key === selected;
        return (
          <div
            key={key}
            className="orbit-slot absolute"
            style={{ left: `${50 + radius * Math.cos(angle)}%`, top: `${50 + radius * Math.sin(angle)}%`, marginLeft: -tile / 2, marginTop: -tile / 2 }}
          >
            <button
              type="button"
              onClick={() => onPick(key)}
              aria-label={`Add ${platform.name}`}
              aria-pressed={active}
              className="orbit-tile grid place-items-center rounded-2xl border-2 border-ink"
              style={{
                ...style,
                width: tile,
                height: tile,
                background: platform.color,
                boxShadow: active ? "0 0 0 4px #C6F432, 4px 4px 0 4px #121212" : "3px 3px 0 #121212",
              }}
            >
              <PlatformIcon platform={key} size={tile * 0.46} color={readableOn(platform.color)} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function PlatformOrbit() {
  const [selected, setSelected] = useState<PlatformKey>("instagram");
  const [touched, setTouched] = useState(false);

  // Walks through platforms on its own until the visitor picks one.
  useEffect(() => {
    if (touched) return;
    const id = setInterval(() => setSelected((s) => ALL[(ALL.indexOf(s) + 1) % ALL.length]), 2400);
    return () => clearInterval(id);
  }, [touched]);

  const pick = (key: PlatformKey) => {
    setTouched(true);
    setSelected(key);
  };
  const platform = getPlatform(selected)!;

  return (
    <section id="platforms" className="overflow-hidden bg-lilac px-4 py-24 sm:px-5 lg:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14">
        <Reveal className="flex min-w-0 flex-[1_1_380px] flex-col gap-6">
          <Eyebrow>{PLATFORM_LIST.length}+ platforms supported</Eyebrow>
          <SectionHeading>Every platform you&apos;re on, orbiting you.</SectionHeading>
          <p className="max-w-[460px] text-lg leading-relaxed text-body">
            Tap a logo to add it. Socials, music, messaging apps, creator platforms and up to 5 personal websites, all on one page.
          </p>
          <div className="flex max-w-[440px] items-center gap-4 rounded-2xl border-2 border-ink bg-white p-4 shadow-brutal" aria-live="polite">
            <PlatformTile platform={selected} tileSize={52} size={26} className="border-2 border-ink transition-colors" />
            <div className="min-w-0 flex-1">
              <div className="text-[17px] font-bold">{platform.name} added to your Lnk</div>
              <div className="text-sm text-muted">Visitors can reach you there in one tap</div>
            </div>
            <svg key={selected} viewBox="0 0 24 24" className="size-[30px] shrink-0" aria-hidden>
              <path d="M4 12l5 5L20 6" fill="none" stroke="#3D7A00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" />
            </svg>
          </div>
        </Reveal>

        <div className="flex min-w-0 flex-[1_1_420px] justify-center">
          <div className="orbit relative aspect-square w-[min(540px,100%)]">
            <div className="absolute inset-[20%] rounded-full border-2 border-dashed border-lilac-line" />
            <div className="absolute inset-[4%] rounded-full border-2 border-dashed border-lilac-line" />
            <div className="jelly absolute inset-[37%] flex flex-col items-center justify-center gap-1 rounded-full border-[3px] border-ink bg-lime shadow-brutal">
              <svg viewBox="0 0 40 40" className="animate-wiggle size-[clamp(24px,7%,40px)]" aria-hidden>
                <rect x="3" y="12" width="20" height="14" rx="7" fill="none" stroke="#5B3DF5" strokeWidth="4" />
                <rect x="17" y="14" width="20" height="14" rx="7" fill="none" stroke="#121212" strokeWidth="4" />
              </svg>
              <span className="font-display text-[clamp(12px,3vw,17px)]">@you</span>
            </div>
            <Ring keys={ORBIT_INNER} radius={30} tile={56} duration={36} selected={selected} onPick={pick} />
            <Ring keys={ORBIT_OUTER} radius={46} tile={46} duration={54} reverse selected={selected} onPick={pick} />
          </div>
        </div>
      </div>
    </section>
  );
}

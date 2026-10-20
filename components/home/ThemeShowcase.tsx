"use client";

import { useEffect, useState } from "react";
import { ProfileView } from "@/components/profile/ProfileView";
import { Button } from "@/components/ui/Button";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SAMPLE_PROFILE, SHOWCASE_THEMES } from "@/lib/home-content";
import { THEMES } from "@/lib/themes";
import { cn } from "@/lib/utils";

export function ThemeShowcase() {
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);

  // Auto-plays through the themes until someone picks one.
  useEffect(() => {
    if (touched) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SHOWCASE_THEMES.length), 3000);
    return () => clearInterval(id);
  }, [touched]);

  const current = SHOWCASE_THEMES[index];
  const theme = THEMES[current.theme];

  return (
    <section id="themes" className="border-y-[3px] border-ink bg-violet px-4 py-24 text-white sm:px-5 lg:py-28">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14">
        <Reveal className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
          <SectionHeading>Make it unmistakably yours.</SectionHeading>
          <p className="max-w-[480px] text-lg leading-relaxed text-[#ECE8FF]">
            Tap a theme to try it. Buttons, fonts and backgrounds update live as you edit.
          </p>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Preview theme">
            {SHOWCASE_THEMES.map((t, i) => (
              <button
                key={t.theme}
                type="button"
                role="radio"
                aria-checked={i === index}
                aria-label={`${THEMES[t.theme].name} theme`}
                onClick={() => {
                  setTouched(true);
                  setIndex(i);
                }}
                className={cn(
                  "jelly size-16 rounded-2xl border-[3px] border-ink transition-[outline-offset] outline-offset-2",
                  i === index ? "outline-[3px] outline-white outline-solid" : "outline-0",
                )}
                style={{ background: THEMES[t.theme].bg }}
              />
            ))}
          </div>
          <p key={current.theme} className="animate-word font-display text-2xl">
            {theme.name}
          </p>
          <Button href="/auth/register" variant="lime" size="lg" className="self-start [--lift-shadow:#121212]">
            Try the editor
          </Button>
        </Reveal>

        <div className="flex min-w-0 flex-[1_1_320px] justify-center">
          <div className="animate-floaty [--r:3deg]">
            <PhoneFrame width={280} height={540} shadow="ink">
              <ProfileView preview profile={{ ...SAMPLE_PROFILE, appearance: { ...SAMPLE_PROFILE.appearance, theme: current.theme, buttonStyle: current.buttonStyle } }} views={12480} />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}

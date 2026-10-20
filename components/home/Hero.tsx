"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ProfileView } from "@/components/profile/ProfileView";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Sticker } from "@/components/ui/Sticker";
import { HERO_WORDS, SAMPLE_PROFILE, VIEW_CITIES } from "@/lib/home-content";
import { useCountUp, useCycle } from "@/lib/hooks";
import { siteHost } from "@/lib/site";
import { sanitizeUsernameInput } from "@/lib/username";
import { formatNumber } from "@/lib/utils";

const PERKS = ["Free forever plan", "No password needed", "Live analytics"];

export function Hero() {
  const router = useRouter();
  const [name, setName] = useState("");
  const word = useCycle(HERO_WORDS.length, 2000);
  const city = useCycle(VIEW_CITIES.length, 2600);
  const views = useCountUp(12480);
  const clicks = useCountUp(284, true, 1800);

  const claim = (e: FormEvent) => {
    e.preventDefault();
    router.push(name ? `/auth/register?username=${encodeURIComponent(name)}` : "/auth/register");
  };

  return (
    <section className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-14 px-4 pb-24 pt-10 sm:px-5 lg:pt-14">
      <div className="stagger flex min-w-0 flex-[1_1_480px] flex-col gap-6">
        <Eyebrow>
          <span className="size-2.5 animate-pulse-ring rounded-full bg-success" />
          One link for
          <span key={word} className="animate-word min-w-[5.5rem] font-bold text-violet">
            {HERO_WORDS[word]}
          </span>
        </Eyebrow>

        <h1 className="font-display text-[clamp(40px,6vw,80px)] leading-[1.02] tracking-[-0.03em] text-balance">
          Everything you are, in one{" "}
          <span className="relative inline-block text-violet">
            lnk.
            <Sticker name="squiggle" width={300} height={22} className="absolute -bottom-3 left-0 h-[22px] w-full" eager />
          </span>
        </h1>

        <p className="max-w-[520px] text-lg leading-relaxed text-body sm:text-xl">
          Bring your Instagram, TikTok, Spotify, OnlyFans, blog and up to 5 personal sites together on one page. Sign in with Google and go live in 60 seconds.
        </p>

        <form onSubmit={claim} className="flex max-w-[480px] flex-wrap items-center gap-2 rounded-[28px] border-2 border-ink bg-white p-1.5 shadow-brutal sm:rounded-full">
          <label htmlFor="claim" className="pl-4 text-base text-muted sm:text-[17px]">
            {siteHost}/@
          </label>
          <input
            id="claim"
            value={name}
            onChange={(e) => setName(sanitizeUsernameInput(e.target.value))}
            placeholder="yourname"
            autoComplete="off"
            className="min-w-0 flex-[1_1_100px] bg-transparent py-3 text-[17px] outline-none"
          />
          <button type="submit" className="jelly min-h-12 w-full rounded-full bg-lime px-6 font-bold sm:w-auto">
            Claim it
          </button>
        </form>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-body">
          {PERKS.map((perk, i) => (
            <li key={perk} className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
                <path d="M4 12l5 5L20 6" fill="none" stroke="#3D7A00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-draw" style={{ animationDelay: `${1 + i * 0.2}s` }} />
              </svg>
              {perk}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex min-h-[660px] flex-[1_1_340px] items-center justify-center">
        <Sticker name="star" size={96} className="absolute right-[6%] top-0 animate-spin-slow" eager />
        <Sticker name="smiley" size={84} className="animate-floaty absolute bottom-6 left-0 z-10 [--r:-12deg]" eager />

        <div className="animate-pop absolute left-0 top-20 z-10 rounded-2xl border-2 border-ink bg-white px-4 py-3 text-sm shadow-brutal-sm [animation-delay:.9s] max-sm:left-1">
          <div className="text-muted">Link clicks today</div>
          <div className="text-2xl font-bold">+{formatNumber(clicks)}</div>
        </div>
        <div key={city} className="animate-pop absolute bottom-32 right-0 z-10 rounded-2xl border-2 border-ink bg-violet px-4 py-3 text-sm font-semibold text-white shadow-brutal-sm max-sm:right-1">
          New view from {VIEW_CITIES[city]}
        </div>

        <div className="animate-floaty [--r:-3deg]">
          <PhoneFrame>
            <ProfileView preview profile={{ ...SAMPLE_PROFILE, username: name || SAMPLE_PROFILE.username }} views={Math.round(views)} />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

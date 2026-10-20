import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { Sticker } from "@/components/ui/Sticker";
import type { PlatformKey } from "@/lib/platforms";

export function LoginAside() {
  return (
    <div className="flex w-full max-w-[360px] flex-col gap-4">
      <div className="animate-floaty flex items-center gap-3.5 rounded-[20px] border-2 border-ink bg-white p-5 shadow-brutal [--r:-2deg]">
        <span className="grid size-12 place-items-center rounded-full bg-violet font-bold text-white">TK</span>
        <div>
          <div className="font-bold">@tobi.k</div>
          <div className="text-[13px] text-muted">8,140 views this month</div>
        </div>
      </div>
      <div className="animate-floaty rounded-[20px] border-2 border-ink bg-ink p-5 text-white shadow-[5px_5px_0_#5B3DF5] [--r:1.5deg] [animation-delay:.5s]">
        <div className="text-[13px] text-[#D4D4CE]">Top link today</div>
        <div className="mt-1 flex items-center gap-2 text-xl font-bold">
          <PlatformIcon platform="youtube" size={22} color="#FF4D4D" /> YouTube · 412 clicks
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Sticker name="smileyWhite" size={72} className="animate-floaty [--r:-10deg]" />
        <Sticker name="star" size={52} className="animate-spin-slow" />
      </div>
      <h2 className="mt-4 font-display text-[34px] leading-[1.05] tracking-[-0.02em]">Your audience missed you.</h2>
    </div>
  );
}

const CHIPS: { label: string; platform?: PlatformKey; lime?: boolean }[] = [
  { label: "Instagram", platform: "instagram" },
  { label: "TikTok", platform: "tiktok", lime: true },
  { label: "YouTube", platform: "youtube" },
  { label: "Spotify", platform: "spotify" },
  { label: "OnlyFans", platform: "onlyfans" },
  { label: "Blog", platform: "blog", lime: true },
  { label: "X", platform: "x" },
  { label: "WhatsApp", platform: "whatsapp" },
];

export function RegisterAside() {
  return (
    <div className="flex w-full max-w-[460px] flex-col gap-8 text-white">
      <h2 className="font-display text-[clamp(34px,4vw,52px)] leading-none tracking-[-0.02em]">All your platforms. One tidy page.</h2>
      <ul className="stagger flex flex-wrap gap-2.5">
        {CHIPS.map((chip) => (
          <li
            key={chip.label}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-ink transition-transform duration-300 hover:-rotate-6 hover:scale-110 ${chip.lime ? "bg-lime" : "bg-white"}`}
          >
            <PlatformIcon platform={chip.platform} size={16} />
            {chip.label}
          </li>
        ))}
        <li className="rounded-full border-2 border-white px-4 py-2 text-sm font-bold">+ 5 websites</li>
      </ul>
      <div className="flex items-center gap-4">
        <Sticker name="starLime" size={56} className="animate-spin-slow" />
        <p className="text-base text-[#ECE8FF]">Join thousands of creators already sharing with Lnk.</p>
      </div>
    </div>
  );
}

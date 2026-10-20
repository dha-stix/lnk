import type { PlatformKey } from "./platforms";
import { DEFAULT_APPEARANCE, type ButtonStyleKey, type ThemeKey } from "./themes";
import type { UserProfile } from "./types";

export const HERO_WORDS = ["creators", "artists", "musicians", "founders", "gamers"];
export const VIEW_CITIES = ["Lagos", "London", "Accra", "Toronto", "New York", "Nairobi"];

export const SAMPLE_PROFILE: UserProfile = {
  uid: "sample",
  username: "amara",
  displayName: "Amara Obi",
  bio: "Photographer · Lagos → London",
  photoURL: null,
  googlePhotoURL: null,
  socials: [
    { id: "ig", platform: "instagram", value: "amara.shoots", url: "https://instagram.com/amara.shoots", enabled: true },
    { id: "tt", platform: "tiktok", value: "amara.shoots", url: "https://tiktok.com/@amara.shoots", enabled: true },
    { id: "sp", platform: "spotify", value: "https://open.spotify.com", url: "https://open.spotify.com", enabled: true },
    { id: "bl", platform: "blog", value: "https://amaraobi.blog", url: "https://amaraobi.blog", enabled: true },
  ],
  websites: [{ id: "pf", title: "My Portfolio", url: "https://amaraobi.studio", enabled: true }],
  appearance: DEFAULT_APPEARANCE,
  settings: { adultWarning: true, indexable: true },
};

export const STEPS = [
  { sticker: "person", title: "Sign in with Google", body: "No passwords. Your Google photo becomes your avatar until you upload your own." },
  { sticker: "chain", title: "Add your links", body: "Pick platforms, paste handles, add up to 5 personal websites and a short bio." },
  { sticker: "paperPlane", title: "Share and grow", body: "Drop your Lnk in every bio and watch views and clicks roll in." },
] as const;

export const ORBIT_INNER: PlatformKey[] = ["instagram", "tiktok", "youtube", "x", "facebook", "onlyfans"];
export const ORBIT_OUTER: PlatformKey[] = ["linkedin", "spotify", "bluesky", "discord", "whatsapp", "telegram", "mastodon", "twitch", "blog"];

export const CREATORS: {
  initials: string;
  handle: string;
  role: string;
  bg: string;
  fg: string;
  tilt: string;
  links: { title: string; platform?: PlatformKey }[];
  views: string;
}[] = [
  { initials: "AM", handle: "amara", role: "Photographer", bg: "#FFFFFF", fg: "#121212", tilt: "-2deg", views: "4,210", links: [{ title: "Instagram", platform: "instagram" }, { title: "Portfolio" }, { title: "Print shop" }] },
  { initials: "TK", handle: "tobi.beats", role: "Music producer", bg: "#C6F432", fg: "#121212", tilt: "1.5deg", views: "9,874", links: [{ title: "Spotify", platform: "spotify" }, { title: "YouTube", platform: "youtube" }, { title: "Beat store" }] },
  { initials: "ZN", handle: "chefzee", role: "Food creator", bg: "#FF8A5B", fg: "#121212", tilt: "-1deg", views: "6,032", links: [{ title: "TikTok", platform: "tiktok" }, { title: "Recipes blog", platform: "blog" }, { title: "WhatsApp orders", platform: "whatsapp" }] },
  { initials: "RX", handle: "rexplays", role: "Streamer", bg: "#5B3DF5", fg: "#FFFFFF", tilt: "2deg", views: "12,451", links: [{ title: "Twitch", platform: "twitch" }, { title: "Discord", platform: "discord" }, { title: "X", platform: "x" }] },
];

export const SHOWCASE_THEMES: { theme: ThemeKey; buttonStyle: ButtonStyleKey }[] = [
  { theme: "paper", buttonStyle: "filled" },
  { theme: "lime", buttonStyle: "pill" },
  { theme: "sunset", buttonStyle: "shadow" },
  { theme: "blush", buttonStyle: "pill" },
  { theme: "ocean", buttonStyle: "outline" },
];

export const FAQS = [
  { q: "Is Lnk free?", a: "Yes. Unlimited social links, 5 personal websites, every theme and full analytics are free." },
  { q: "Which platforms can I add?", a: "All the major socials (Instagram, TikTok, X, Facebook, LinkedIn, Bluesky, Mastodon…), music like Spotify and SoundCloud, messaging apps like WhatsApp, Telegram and Discord, creator platforms like OnlyFans and Patreon, blogs, and up to 5 personal websites." },
  { q: "Can visitors see my view count?", a: "Yes. Your total page views show on your public page as social proof. You can hide it any time in Appearance." },
  { q: "What photo do visitors see?", a: "Your Google profile photo, until you upload one of your own. You can switch back to the Google photo whenever you like." },
];

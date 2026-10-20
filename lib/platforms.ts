import {
  siApplemusic, siBandcamp, siBehance, siBluesky, siBuymeacoffee, siCashapp, siDiscord, siDribbble,
  siEtsy, siFacebook, siGithub, siInstagram, siKick, siKofi, siLinkedin, siMastodon, siMedium,
  siOnlyfans, siPatreon, siPinterest, siReddit, siSignal, siSnapchat, siSoundcloud, siSpotify,
  siSubstack, siTelegram, siThreads, siTiktok, siTumblr, siTwitch, siVimeo, siWhatsapp, siX,
  siYoutube, siYoutubemusic,
} from "simple-icons";
import { normalizeUrl } from "./utils";

/** Generic glyphs (Material icons, 24×24) for things that aren't brands. */
export const GENERIC_ICONS = {
  link: "M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10z",
  blog: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
  email: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
  heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
};

export type PlatformCategory = "social" | "creator" | "messaging" | "music" | "writing" | "work";

export const CATEGORY_LABELS: Record<PlatformCategory, string> = {
  social: "Social",
  creator: "Creator & support",
  messaging: "Messaging",
  music: "Music & video",
  writing: "Blogs & writing",
  work: "Work & shops",
};

type PlatformDef = {
  name: string;
  category: PlatformCategory;
  path: string;
  color: string;
  placeholder: string;
  /** Builds a URL from a bare handle. Platforms without one need a full link. */
  fromHandle?: (handle: string) => string;
  adult?: boolean;
};

const brand = (icon: { path: string; hex: string }) => ({ path: icon.path, color: `#${icon.hex}` });
const at = (base: string) => (h: string) => `${base}${h}`;

export const PLATFORMS = {
  instagram: { name: "Instagram", category: "social", ...brand(siInstagram), placeholder: "yourhandle", fromHandle: at("https://instagram.com/") },
  tiktok: { name: "TikTok", category: "social", ...brand(siTiktok), placeholder: "yourhandle", fromHandle: at("https://tiktok.com/@") },
  x: { name: "X", category: "social", ...brand(siX), placeholder: "yourhandle", fromHandle: at("https://x.com/") },
  facebook: { name: "Facebook", category: "social", ...brand(siFacebook), placeholder: "yourpage", fromHandle: at("https://facebook.com/") },
  threads: { name: "Threads", category: "social", ...brand(siThreads), placeholder: "yourhandle", fromHandle: at("https://threads.net/@") },
  snapchat: { name: "Snapchat", category: "social", ...brand(siSnapchat), placeholder: "yourhandle", fromHandle: at("https://snapchat.com/add/") },
  linkedin: { name: "LinkedIn", category: "social", ...brand(siLinkedin), placeholder: "your-profile", fromHandle: at("https://linkedin.com/in/") },
  bluesky: { name: "Bluesky", category: "social", ...brand(siBluesky), placeholder: "you.bsky.social", fromHandle: at("https://bsky.app/profile/") },
  mastodon: {
    name: "Mastodon", category: "social", ...brand(siMastodon), placeholder: "@you@mastodon.social",
    fromHandle: (h) => {
      const [user, server] = h.split("@").filter(Boolean);
      return server ? `https://${server}/@${user}` : `https://mastodon.social/@${user}`;
    },
  },
  pinterest: { name: "Pinterest", category: "social", ...brand(siPinterest), placeholder: "yourhandle", fromHandle: at("https://pinterest.com/") },
  reddit: { name: "Reddit", category: "social", ...brand(siReddit), placeholder: "yourname", fromHandle: at("https://reddit.com/user/") },
  tumblr: { name: "Tumblr", category: "social", ...brand(siTumblr), placeholder: "yourblog", fromHandle: (h) => `https://${h}.tumblr.com` },

  onlyfans: { name: "OnlyFans", category: "creator", ...brand(siOnlyfans), placeholder: "yourname", fromHandle: at("https://onlyfans.com/"), adult: true },
  fansly: { name: "Fansly", category: "creator", path: GENERIC_ICONS.heart, color: "#1FA7F8", placeholder: "yourname", fromHandle: at("https://fansly.com/"), adult: true },
  patreon: { name: "Patreon", category: "creator", ...brand(siPatreon), placeholder: "yourname", fromHandle: at("https://patreon.com/") },
  kofi: { name: "Ko-fi", category: "creator", ...brand(siKofi), placeholder: "yourname", fromHandle: at("https://ko-fi.com/") },
  buymeacoffee: { name: "Buy Me a Coffee", category: "creator", ...brand(siBuymeacoffee), placeholder: "yourname", fromHandle: at("https://buymeacoffee.com/") },
  cashapp: { name: "Cash App", category: "creator", ...brand(siCashapp), placeholder: "$yourtag", fromHandle: (h) => `https://cash.app/$${h.replace(/^\$/, "")}` },

  whatsapp: { name: "WhatsApp", category: "messaging", ...brand(siWhatsapp), placeholder: "447700900123", fromHandle: (h) => `https://wa.me/${h.replace(/\D/g, "")}` },
  telegram: { name: "Telegram", category: "messaging", ...brand(siTelegram), placeholder: "yourhandle", fromHandle: at("https://t.me/") },
  discord: { name: "Discord", category: "messaging", ...brand(siDiscord), placeholder: "invite code or link", fromHandle: at("https://discord.gg/") },
  signal: { name: "Signal", category: "messaging", ...brand(siSignal), placeholder: "https://signal.me/#eu/…" },
  email: { name: "Email", category: "messaging", path: GENERIC_ICONS.email, color: "#5B3DF5", placeholder: "you@example.com", fromHandle: (h) => `mailto:${h}` },

  youtube: { name: "YouTube", category: "music", ...brand(siYoutube), placeholder: "yourchannel", fromHandle: at("https://youtube.com/@") },
  spotify: { name: "Spotify", category: "music", ...brand(siSpotify), placeholder: "https://open.spotify.com/artist/…" },
  applemusic: { name: "Apple Music", category: "music", ...brand(siApplemusic), placeholder: "https://music.apple.com/…" },
  youtubemusic: { name: "YouTube Music", category: "music", ...brand(siYoutubemusic), placeholder: "https://music.youtube.com/…" },
  soundcloud: { name: "SoundCloud", category: "music", ...brand(siSoundcloud), placeholder: "yourname", fromHandle: at("https://soundcloud.com/") },
  bandcamp: { name: "Bandcamp", category: "music", ...brand(siBandcamp), placeholder: "yourname", fromHandle: (h) => `https://${h}.bandcamp.com` },
  twitch: { name: "Twitch", category: "music", ...brand(siTwitch), placeholder: "yourchannel", fromHandle: at("https://twitch.tv/") },
  kick: { name: "Kick", category: "music", ...brand(siKick), placeholder: "yourchannel", fromHandle: at("https://kick.com/") },
  vimeo: { name: "Vimeo", category: "music", ...brand(siVimeo), placeholder: "yourname", fromHandle: at("https://vimeo.com/") },

  blog: { name: "Blog", category: "writing", path: GENERIC_ICONS.blog, color: "#E8590C", placeholder: "https://yourblog.com" },
  substack: { name: "Substack", category: "writing", ...brand(siSubstack), placeholder: "yourname", fromHandle: (h) => `https://${h}.substack.com` },
  medium: { name: "Medium", category: "writing", ...brand(siMedium), placeholder: "yourname", fromHandle: at("https://medium.com/@") },

  github: { name: "GitHub", category: "work", ...brand(siGithub), placeholder: "yourname", fromHandle: at("https://github.com/") },
  behance: { name: "Behance", category: "work", ...brand(siBehance), placeholder: "yourname", fromHandle: at("https://behance.net/") },
  dribbble: { name: "Dribbble", category: "work", ...brand(siDribbble), placeholder: "yourname", fromHandle: at("https://dribbble.com/") },
  etsy: { name: "Etsy", category: "work", ...brand(siEtsy), placeholder: "yourshop", fromHandle: at("https://etsy.com/shop/") },
} satisfies Record<string, PlatformDef>;

export type PlatformKey = keyof typeof PLATFORMS;
export type Platform = PlatformDef & { key: PlatformKey };

export const PLATFORM_LIST: Platform[] = (Object.keys(PLATFORMS) as PlatformKey[]).map((key) => ({
  key,
  ...PLATFORMS[key],
}));

export const MAX_WEBSITES = 5;

export function getPlatform(key: string): Platform | undefined {
  return key in PLATFORMS ? { key: key as PlatformKey, ...PLATFORMS[key as PlatformKey] } : undefined;
}

export const isPlatformKey = (key: string): key is PlatformKey => key in PLATFORMS;

/** Turns whatever the user typed (handle, number or link) into a URL. */
export function resolvePlatformUrl(key: PlatformKey, input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  const platform: PlatformDef = PLATFORMS[key];
  const looksLikeUrl = /^(https?:\/\/|mailto:)/i.test(value) || /^[\w-]+(\.[\w-]+)+\//.test(value);
  if (looksLikeUrl || !platform.fromHandle) return normalizeUrl(value);
  const handle = key === "mastodon" || key === "email" ? value : value.replace(/^@/, "").replace(/\/+$/, "");
  if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(handle)) return null;
  return normalizeUrl(platform.fromHandle(encodeURI(handle)));
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getPlatform, type PlatformKey } from "@/lib/platforms";
import { siteHost } from "@/lib/site";
import { getTheme } from "@/lib/themes";
import type { PublicProfile } from "@/lib/types";
import { formatCompact, getInitials, readableOn, trustedPhotoUrl } from "@/lib/utils";

/**
 * Link-preview ("Open Graph") images shown when a Lnk URL is shared on
 * WhatsApp, X, Facebook, LinkedIn, iMessage, Slack, Discord and others.
 */

export const OG_SIZE = { width: 1200, height: 630 };

// ImageResponse needs TTF/OTF, so these are read once at module scope.
const fontsDir = join(process.cwd(), "styles/fonts");
const [isometra, funnelRegular, funnelBold] = await Promise.all([
  readFile(join(fontsDir, "Isometra-Regular.ttf")),
  readFile(join(fontsDir, "FunnelSans-Regular.ttf")),
  readFile(join(fontsDir, "FunnelSans-Bold.ttf")),
]);

const FONTS = [
  { name: "Isometra", data: isometra, weight: 400 as const, style: "normal" as const },
  { name: "Funnel", data: funnelRegular, weight: 400 as const, style: "normal" as const },
  { name: "Funnel", data: funnelBold, weight: 700 as const, style: "normal" as const },
];

const INK = "#121212";
const LIME = "#C6F432";
const VIOLET = "#5B3DF5";

// Previews are cached by the platforms anyway; let CDNs keep them for a while too.
const HEADERS = { "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400" };

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** Fetches a photo as a data URL. Only PNG/JPEG, because the renderer can't decode WebP. */
async function loadPhoto(rawUrl: string | null) {
  // Only Google and Firebase Storage hosts, so a tampered profile can't make the server fetch other URLs.
  const url = trustedPhotoUrl(rawUrl);
  if (!url) return null;
  try {
    const res = await fetch(url, { headers: { Accept: "image/png,image/jpeg" }, signal: AbortSignal.timeout(4000) });
    const type = (res.headers.get("content-type") ?? "").split(";")[0];
    if (!res.ok || !/^image\/(png|jpe?g)$/.test(type)) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

function LogoMark({ size, color = INK }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect x="3" y="12" width="20" height="14" rx="7" fill="none" stroke={VIOLET} strokeWidth="4" />
      <rect x="17" y="14" width="20" height="14" rx="7" fill="none" stroke={color} strokeWidth="4" />
    </svg>
  );
}

function Wordmark({ size, color = INK }: { size: number; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.2, fontFamily: "Isometra", fontSize: size, color }}>
      <LogoMark size={size * 1.15} color={color} />
      <span>lnk</span>
      <span style={{ color: color === INK ? VIOLET : LIME }}>.</span>
    </div>
  );
}

function PlatformTile({ platform, size }: { platform: PlatformKey | string; size: number }) {
  const p = getPlatform(platform);
  if (!p) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: p.color,
        border: `4px solid ${INK}`,
        boxShadow: `5px 5px 0 ${INK}`,
      }}
    >
      <svg width={size * 0.48} height={size * 0.48} viewBox="0 0 24 24">
        <path d={p.path} fill={readableOn(p.color)} />
      </svg>
    </div>
  );
}

function Star({ size, fill }: { size: number; fill: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M50 3 L61 36 L97 38 L68 60 L79 97 L50 75 L21 97 L32 60 L3 38 L39 36Z" fill={fill} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

const SITE_TILES: PlatformKey[] = ["instagram", "tiktok", "youtube", "spotify", "x", "whatsapp", "onlyfans", "linkedin", "discord"];

/** The default preview for the homepage and every page without its own. */
export function siteImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: LIME, padding: 64, fontFamily: "Funnel", color: INK, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 690 }}>
          <Wordmark size={48} />
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Isometra", fontSize: 76, lineHeight: 1.04, letterSpacing: -1 }}>
              <span>Everything you are,</span>
              <span>
                in one&nbsp;<span style={{ color: VIOLET }}>lnk.</span>
              </span>
            </div>
            <div style={{ fontSize: 30, lineHeight: 1.35, color: "#2A2A26", maxWidth: 620 }}>
              Your socials, music, blogs and websites on one page. Sign in with Google and go live in 60 seconds.
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", background: INK, color: "#FFFFFF", borderRadius: 999, padding: "14px 28px", fontSize: 28, fontWeight: 700 }}>
              {siteHost}/@you
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 28, width: 380, alignContent: "center", justifyContent: "center", marginLeft: "auto" }}>
          {SITE_TILES.map((key) => (
            <PlatformTile key={key} platform={key} size={100} />
          ))}
        </div>
        <div style={{ display: "flex", position: "absolute", top: 40, right: 48 }}>
          <Star size={70} fill="#FFFFFF" />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: FONTS, headers: HEADERS },
  );
}

/** A preview built from the user's own page: theme, photo, name, bio, views and platforms. */
export async function profileImage(data: PublicProfile | null) {
  if (!data) return siteImage();
  const { profile, stats } = data;
  const theme = getTheme(profile.appearance.theme);
  const name = profile.displayName || profile.username;
  const photo = (await loadPhoto(profile.photoURL)) ?? (await loadPhoto(profile.googlePhotoURL));
  const platforms = Array.from(new Set(profile.socials.filter((s) => s.enabled && s.url).map((s) => s.platform))).slice(0, 7);
  const linkCount = profile.socials.filter((s) => s.enabled && s.url).length + profile.websites.filter((w) => w.enabled && w.url).length;
  const bio = clip(profile.bio.replace(/\s*\n+\s*/g, " · "), 120);

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: theme.bg, color: theme.text, fontFamily: "Funnel" }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 64, padding: "56px 72px 40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 300,
              height: 300,
              flexShrink: 0,
              borderRadius: 999,
              border: `6px dashed ${theme.text}`,
            }}
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} width={264} height={264} alt="" style={{ borderRadius: 999, objectFit: "cover", border: "8px solid #FFFFFF" }} />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 264,
                  height: 264,
                  borderRadius: 999,
                  background: LIME,
                  border: "8px solid #FFFFFF",
                  fontFamily: "Isometra",
                  fontSize: 104,
                  color: INK,
                }}
              >
                {getInitials(name)}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", fontFamily: "Isometra", fontSize: name.length > 16 ? 60 : 76, lineHeight: 1.05 }}>{clip(name, 26)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: theme.muted }}>
              <span>@{profile.username}</span>
              {profile.appearance.showViews && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: theme.accent,
                    color: theme.accentText,
                    borderRadius: 999,
                    padding: "6px 18px",
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  <span style={{ width: 12, height: 12, borderRadius: 999, background: "#3D7A00" }} />
                  {formatCompact(stats.views)} page views
                </span>
              )}
            </div>
            {bio && <div style={{ display: "flex", fontSize: 30, lineHeight: 1.4, color: theme.muted, maxWidth: 680 }}>{bio}</div>}
            {platforms.length > 0 && (
              <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
                {platforms.map((key) => (
                  <PlatformTile key={key} platform={key} size={68} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: INK, color: "#FFFFFF", padding: "22px 72px", fontSize: 28 }}>
          <div style={{ display: "flex", fontWeight: 700 }}>
            {siteHost}/@{profile.username}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{ color: "#D4D4CE" }}>
              {linkCount} {linkCount === 1 ? "link" : "links"}
            </span>
            <Wordmark size={32} color="#FFFFFF" />
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: FONTS, headers: HEADERS },
  );
}

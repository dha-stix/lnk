import Link from "next/link";
import type { AnchorHTMLAttributes, CSSProperties, MouseEvent } from "react";
import { Avatar, avatarSrc } from "@/components/ui/Avatar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { getPlatform } from "@/lib/platforms";
import { FONTS, getTheme, linkButtonStyle } from "@/lib/themes";
import type { UserProfile } from "@/lib/types";
import { cn, formatCompact, getHost, normalizeUrl } from "@/lib/utils";

export type ProfileLinkItem = {
  id: string;
  title: string;
  url: string;
  platform?: string;
  adult?: boolean;
};

type ProfileViewProps = {
  profile: Pick<UserProfile, "displayName" | "username" | "bio" | "photoURL" | "googlePhotoURL" | "socials" | "websites" | "appearance">;
  views?: number;
  /** Compact layout for phone previews inside the dashboard. */
  preview?: boolean;
  /** Let the parent paint the background (the public page adds decoration behind). */
  transparent?: boolean;
  onLinkClick?: (event: MouseEvent<HTMLAnchorElement>, item: ProfileLinkItem) => void;
};

/** Everything visitors see on /@username. Also powers the live previews. */
export function ProfileView({ profile, views, preview, transparent, onLinkClick }: ProfileViewProps) {
  const theme = getTheme(profile.appearance.theme);
  const button = linkButtonStyle(profile.appearance.buttonStyle, theme);
  // Re-check every URL at render time: only http(s) and mailto links are ever shown,
  // even if something else was written to the database directly.
  const socials = profile.socials
    .map((s) => ({ ...s, url: normalizeUrl(s.url) ?? "" }))
    .filter((s) => s.enabled && s.url);
  const websites = profile.websites
    .map((w) => ({ ...w, url: normalizeUrl(w.url) ?? "" }))
    .filter((w) => w.enabled && w.url);
  const name = profile.displayName || profile.username;

  const socialItems: ProfileLinkItem[] = socials.map((s) => {
    const platform = getPlatform(s.platform);
    return { id: s.id, title: platform?.name ?? "Link", url: s.url, platform: s.platform, adult: platform?.adult };
  });
  const websiteItems: ProfileLinkItem[] = websites.map((w) => ({ id: w.id, title: w.title || getHost(w.url), url: w.url }));

  const linkProps = (item: ProfileLinkItem) => ({
    href: item.url,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick: (e: MouseEvent<HTMLAnchorElement>) => onLinkClick?.(e, item),
  });

  return (
    <div
      className="min-h-full transition-colors duration-500"
      style={{ background: transparent ? undefined : theme.bg, color: theme.text, fontFamily: FONTS[profile.appearance.font]?.css }}
    >
      <div className={cn("mx-auto flex w-full flex-col items-center text-center", preview ? "max-w-full gap-3 px-4 py-7" : "max-w-[560px] gap-5 px-5 pb-12 pt-10")}>
        <div className="relative grid place-items-center">
          {!preview && (
            <svg viewBox="0 0 100 100" aria-hidden className="absolute -inset-3 animate-spin-slow" style={{ width: "calc(100% + 24px)", height: "calc(100% + 24px)" }}>
              <circle cx="50" cy="50" r="47" fill="none" stroke={theme.text} strokeWidth="2.5" strokeDasharray="8 7" strokeLinecap="round" />
            </svg>
          )}
          <Avatar src={avatarSrc(profile)} name={name} size={preview ? 76 : 112} className="jelly border-4 border-white" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className={cn("font-display leading-tight", preview ? "text-lg" : "text-3xl sm:text-4xl")}>{name}</h1>
          <p className="text-sm" style={{ color: theme.muted }}>
            @{profile.username}
          </p>
        </div>

        {profile.appearance.showViews && views !== undefined && (
          <span
            className={cn("inline-flex items-center gap-2 rounded-full font-semibold", preview ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm")}
            style={{ background: theme.accent, color: theme.accentText }}
          >
            <span className="size-2 animate-pulse-ring rounded-full bg-success" />
            {formatCompact(views)} page views
          </span>
        )}

        {profile.bio && (
          <p className={cn("max-w-md whitespace-pre-line leading-relaxed", preview ? "text-[13px]" : "text-base")} style={{ color: theme.muted }}>
            {profile.bio}
          </p>
        )}

        {socialItems.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-2.5" aria-label="Social profiles">
            {socialItems.map((item) => (
              <li key={item.id}>
                <a
                  {...linkProps(item)}
                  aria-label={item.title}
                  className={cn("jelly grid place-items-center rounded-full", preview ? "size-9" : "size-11")}
                  style={{ background: theme.button, color: theme.buttonText }}
                >
                  <PlatformIcon platform={item.platform} size={preview ? 16 : 20} />
                </a>
              </li>
            ))}
          </ul>
        )}

        {socialItems.length + websiteItems.length === 0 && (
          <p className="rounded-2xl border-2 border-dashed px-5 py-6 text-sm" style={{ borderColor: theme.muted, color: theme.muted }}>
            No links yet. Add some from your dashboard.
          </p>
        )}

        <ul className={cn("stagger flex w-full flex-col", preview ? "gap-2" : "gap-3")}>
          {socialItems.map((item) => (
            <li key={item.id}>
              <LinkButton item={item} style={button} preview={preview} linkProps={linkProps(item)} />
            </li>
          ))}
        </ul>

        {websiteItems.length > 0 && (
          <div className="flex w-full flex-col gap-3">
            <h2 className="text-left text-xs font-bold tracking-[0.08em]" style={{ color: theme.muted }}>
              MY WEBSITES
            </h2>
            <ul className={cn("stagger flex w-full flex-col", preview ? "gap-2" : "gap-3")}>
              {websiteItems.map((item) => (
                <li key={item.id}>
                  <LinkButton item={item} style={button} preview={preview} linkProps={linkProps(item)} subtitle={getHost(item.url)} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {!preview && (
          <Link
            href="/auth/register"
            className="lift mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-3 text-sm font-bold text-ink"
          >
            Made with <span className="font-display">lnk<span className="text-violet">.</span></span> · Create yours
          </Link>
        )}
      </div>
    </div>
  );
}

type LinkButtonProps = {
  item: ProfileLinkItem;
  style: CSSProperties;
  preview?: boolean;
  subtitle?: string;
  linkProps: AnchorHTMLAttributes<HTMLAnchorElement>;
};

function LinkButton({ item, style, preview, subtitle, linkProps }: LinkButtonProps) {
  return (
    <a
      {...linkProps}
      className={cn(
        "group flex w-full items-center gap-3 font-semibold transition-transform duration-200 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-0.5 hover:scale-[1.015] active:scale-[0.98]",
        preview ? "min-h-11 px-3 text-[13px]" : "min-h-14 px-4 text-base",
      )}
      style={style}
    >
      <PlatformIcon platform={item.platform} size={preview ? 16 : 20} className="transition-transform group-hover:rotate-[-8deg] group-hover:scale-110" />
      <span className="flex min-w-0 flex-1 flex-col items-center py-2">
        <span className="truncate">{item.title}</span>
        {subtitle && !preview && <span className="truncate text-xs font-normal opacity-75">{subtitle}</span>}
      </span>
      {item.adult ? (
        <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-bold text-ink">18+</span>
      ) : (
        <span className={preview ? "w-4" : "w-5"} aria-hidden />
      )}
    </a>
  );
}

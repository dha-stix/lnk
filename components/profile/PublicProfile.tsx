"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Modal } from "@/components/ui/Modal";
import { Sticker } from "@/components/ui/Sticker";
import { recordLinkClick, recordPageView, subscribeToStats } from "@/firebase/firebase-actions";
import { detectDevice, referrerSource } from "@/lib/analytics";
import { profileUrl } from "@/lib/site";
import { getTheme } from "@/lib/themes";
import type { PublicProfile as PublicProfileData } from "@/lib/types";
import { dayKey } from "@/lib/utils";
import { isFirstVisitToday, isOwnerBrowser } from "@/lib/visitor";
import { ProfileView, type ProfileLinkItem } from "./ProfileView";

type PublicProfileProps = PublicProfileData & { country: string | null };

const noopSubscribe = () => () => undefined;

export function PublicProfile({ profile, stats, country }: PublicProfileProps) {
  const [views, setViews] = useState(stats.views);
  const [pending, setPending] = useState<ProfileLinkItem | null>(null);
  const tracked = useRef(false);
  const theme = getTheme(profile.appearance.theme);
  const { user, loading } = useAuth();
  // Read on the client only; the server render always assumes a visitor.
  const ownerBrowser = useSyncExternalStore(noopSubscribe, () => isOwnerBrowser(profile.uid), () => false);
  const isOwner = user?.uid === profile.uid || ownerBrowser;

  // Count this visit once, after the sign-in check, unless it's the owner looking at their own page.
  useEffect(() => {
    if (loading || tracked.current) return;
    tracked.current = true;
    if (user?.uid === profile.uid || isOwnerBrowser(profile.uid)) return;
    recordPageView(profile.uid, {
      referrer: referrerSource(document.referrer, window.location.host),
      device: detectDevice(navigator.userAgent),
      country,
      isUnique: isFirstVisitToday(profile.uid, dayKey()),
    }).catch(() => undefined);
  }, [loading, user, profile.uid, country]);

  // Keep the public counter live.
  useEffect(() => {
    try {
      return subscribeToStats(profile.uid, (s) => setViews(s.views));
    } catch {
      return undefined;
    }
  }, [profile.uid]);

  const trackClick = (id: string) => {
    if (isOwner) return;
    recordLinkClick(profile.uid, id).catch(() => undefined);
  };

  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, item: ProfileLinkItem) => {
    if (item.adult && profile.settings.adultWarning) {
      event.preventDefault();
      setPending(item);
      return;
    }
    trackClick(item.id);
  };

  const continueToAdult = () => {
    if (!pending) return;
    trackClick(pending.id);
    window.open(pending.url, "_blank", "noopener,noreferrer");
    setPending(null);
  };

  const share = async () => {
    const url = profileUrl(profile.username);
    try {
      if (navigator.share) await navigator.share({ title: profile.displayName || profile.username, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  return (
    <div className="relative min-h-dvh overflow-hidden" style={{ background: theme.bg }}>
      <div aria-hidden className="absolute inset-x-0 top-0 h-56 overflow-hidden" style={{ background: theme.text === "#FFFFFF" ? "rgb(255 255 255 / 0.12)" : "#C6F432" }}>
        <Sticker name="starWhite" size={70} className="absolute left-[12%] top-16 animate-spin-slow" />
        <Sticker name="confettiSquare" size={44} className="animate-floaty absolute right-[14%] top-28 [--r:15deg]" />
        <Sticker name="confettiCircle" size={36} className="animate-floaty absolute right-[30%] top-8 [animation-delay:.6s]" />
      </div>

      <div className="relative mx-auto flex max-w-[560px] items-center justify-between px-5 pt-5">
        <Logo size="sm" />
        <button type="button" onClick={share} className="jelly inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-ink bg-white px-4 text-sm font-bold text-ink shadow-brutal-sm">
          <Icon name="share" className="size-4" /> Share
        </button>
      </div>

      {isOwner && (
        <div className="relative mx-auto mt-4 flex max-w-[560px] justify-center px-5">
          <p className="animate-pop flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border-2 border-ink bg-white px-4 py-2 text-center text-[13px] font-semibold text-ink shadow-brutal-sm">
            This is your page. Your visits and clicks aren&apos;t counted.
            <Link href="/dashboard" className="font-bold text-violet underline-offset-2 hover:underline">
              Edit page
            </Link>
          </p>
        </div>
      )}

      <div className="relative mt-10">
        <ProfileView profile={profile} views={views} onLinkClick={onLinkClick} transparent />
      </div>

      <Modal open={Boolean(pending)} onClose={() => setPending(null)} title="Heads up: 18+ content" description={`${pending?.title ?? "This link"} may contain content for adults only.`}>
        <div className="flex flex-col gap-5">
          <p className="text-body">By continuing, you confirm you&apos;re at least 18 years old.</p>
          <div className="flex flex-wrap justify-end gap-2.5">
            <Button variant="outline" shape="rounded" onClick={() => setPending(null)}>Go back</Button>
            <Button shape="rounded" onClick={continueToAdult}>I&apos;m 18 or older</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

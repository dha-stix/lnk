"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar, avatarSrc } from "@/components/ui/Avatar";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Spinner } from "@/components/ui/Spinner";
import { signOutUser } from "@/firebase/firebase-actions";
import { profilePath, siteHost } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CopyLinkButton } from "./CopyLinkButton";
import { useDashboard, type SaveStatus } from "./DashboardProvider";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Links", icon: "links" },
  { href: "/dashboard/appearance", label: "Appearance", icon: "palette" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "chart" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

function SaveIndicator({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  if (status === "idle") return null;
  if (status === "error")
    return (
      <button type="button" onClick={onRetry} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-danger">
        <Icon name="refresh" className="size-4" /> Retry save
      </button>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted" role="status">
      {status === "saving" ? <Spinner className="size-4" /> : <Icon name="check" className="size-4 text-success" />}
      {status === "saving" ? "Saving…" : "Saved"}
    </span>
  );
}

function AccountMenu() {
  const { profile } = useDashboard();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const logout = async () => {
    await signOutUser();
    router.replace("/");
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label="Account menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="jelly rounded-full border-2 border-ink">
        <Avatar src={avatarSrc(profile)} name={profile.displayName || profile.username} size={40} />
      </button>
      {open && (
        <div className="animate-pop absolute right-0 top-[calc(100%+8px)] z-50 w-60 rounded-2xl border-2 border-ink bg-white p-2 shadow-brutal">
          <div className="border-b border-line px-3 pb-3 pt-2">
            <div className="truncate font-bold">{profile.displayName || profile.username}</div>
            <div className="truncate text-sm text-muted">@{profile.username}</div>
          </div>
          <Link href={profilePath(profile.username)} target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-sand">
            <Icon name="external" className="size-4" /> View my page
          </Link>
          <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-sand">
            <Icon name="settings" className="size-4" /> Settings
          </Link>
          <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger hover:bg-sand">
            <Icon name="logout" className="size-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { profile, status, retry } = useDashboard();

  return (
    <div className="min-h-dvh bg-sand">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <Logo size="sm" />
          <div className="flex items-center gap-2 sm:gap-3">
            <SaveIndicator status={status} onRetry={retry} />
            <div className="hidden items-center gap-2 rounded-full bg-sand py-1 pl-4 pr-1 text-sm sm:flex">
              <Link href={profilePath(profile.username)} target="_blank" className="max-w-[220px] truncate font-medium hover:text-violet">
                {siteHost}/@{profile.username}
              </Link>
              <CopyLinkButton username={profile.username} />
            </div>
            <AccountMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1360px] flex-wrap items-start gap-6 px-4 py-6 sm:px-5">
        <nav
          aria-label="Dashboard"
          className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-2 [scrollbar-width:none] lg:sticky lg:top-[88px] lg:w-[220px] lg:flex-col lg:p-3"
        >
          {NAV.map((item) => {
            const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-3 text-[15px] transition-all duration-200",
                  active ? "bg-ink font-bold text-white" : "font-medium text-ink hover:bg-sand lg:hover:translate-x-1",
                )}
              >
                <Icon name={item.icon} className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
          <div className="ml-auto flex shrink-0 items-center sm:hidden">
            <CopyLinkButton username={profile.username} label="Copy link" />
          </div>
        </nav>
        <div className="min-w-0 flex-[999_1_560px]">{children}</div>
      </div>
    </div>
  );
}

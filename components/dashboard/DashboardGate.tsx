"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { SetupNotice } from "@/components/auth/SetupNotice";
import { useAuth } from "@/components/providers/AuthProvider";
import { Logo } from "@/components/ui/Logo";
import { DashboardProvider } from "./DashboardProvider";
import { DashboardShell } from "./DashboardShell";

function FullScreen({ children }: { children: ReactNode }) {
  return <div className="grid min-h-dvh place-items-center bg-sand px-5">{children}</div>;
}

/** Only signed-in users with a page get past here. */
export function DashboardGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, profile, loading, configured } = useAuth();

  useEffect(() => {
    if (loading || !configured) return;
    if (!user) router.replace("/auth/login");
    else if (!profile) router.replace("/auth/register?step=username");
  }, [loading, configured, user, profile, router]);

  if (!configured)
    return (
      <FullScreen>
        <div className="flex max-w-md flex-col gap-5">
          <Logo size="lg" />
          <SetupNotice />
        </div>
      </FullScreen>
    );

  if (loading || !user || !profile)
    return (
      <FullScreen>
        <div className="flex flex-col items-center gap-4" role="status" aria-label="Loading your dashboard">
          <div className="animate-floaty">
            <Logo size="lg" href={null} />
          </div>
          <span className="text-sm text-muted">Loading your page…</span>
        </div>
      </FullScreen>
    );

  return (
    <DashboardProvider key={profile.uid} profile={profile}>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}

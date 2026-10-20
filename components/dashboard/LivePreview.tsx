"use client";

import Link from "next/link";
import { ProfileView } from "@/components/profile/ProfileView";
import { Icon } from "@/components/ui/Icon";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { profilePath } from "@/lib/site";
import { useDashboard } from "./DashboardProvider";
import { useStats } from "./useStats";

export function LivePreview() {
  const { profile } = useDashboard();
  const stats = useStats(profile.uid);

  return (
    <div className="flex flex-col items-center gap-3 xl:sticky xl:top-[88px]">
      <span className="text-[13px] font-bold tracking-[0.06em] text-muted">LIVE PREVIEW</span>
      <div className="animate-floaty">
        <PhoneFrame width={290} height={580}>
          <ProfileView preview profile={profile} views={stats?.views ?? 0} />
        </PhoneFrame>
      </div>
      <Link href={profilePath(profile.username)} target="_blank" className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-violet hover:underline">
        Open my page <Icon name="external" className="size-4" />
      </Link>
    </div>
  );
}

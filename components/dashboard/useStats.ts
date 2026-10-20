"use client";

import { useEffect, useState } from "react";
import { isFirebaseConfigured } from "@/firebase/firebase";
import { subscribeToStats } from "@/firebase/firebase-actions";
import type { ProfileStats } from "@/lib/types";

/** Live running totals (views, clicks) for a profile. */
export function useStats(uid: string | undefined) {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  useEffect(() => {
    if (!uid || !isFirebaseConfigured) return;
    return subscribeToStats(uid, setStats);
  }, [uid]);
  return stats;
}

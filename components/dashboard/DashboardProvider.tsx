"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getErrorMessage, updateUserProfile } from "@/firebase/firebase-actions";
import type { ProfileUpdate, UserProfile } from "@/lib/types";
import { markOwnerBrowser } from "@/lib/visitor";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type DashboardState = {
  /** The profile with unsaved local edits applied, so previews update instantly. */
  profile: UserProfile;
  update: (patch: ProfileUpdate) => void;
  status: SaveStatus;
  retry: () => void;
};

const DashboardContext = createContext<DashboardState | null>(null);
const SAVE_DELAY = 700;

export function DashboardProvider({ profile, children }: { profile: UserProfile; children: ReactNode }) {
  const [overlay, setOverlay] = useState<ProfileUpdate>({});
  const [status, setStatus] = useState<SaveStatus>("idle");
  const pending = useRef<ProfileUpdate>({});
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const uid = profile.uid;

  const save = useCallback(async () => {
    clearTimeout(timer.current);
    const batch = pending.current;
    if (!Object.keys(batch).length) return;
    pending.current = {};
    setStatus("saving");
    try {
      await updateUserProfile(uid, batch);
      // Drop overlay keys that are now saved (unless edited again meanwhile).
      setOverlay((o) => {
        const next = { ...o } as Record<string, unknown>;
        for (const key of Object.keys(batch) as (keyof ProfileUpdate)[]) if (o[key] === batch[key]) delete next[key];
        return next as ProfileUpdate;
      });
      setStatus(Object.keys(pending.current).length ? "saving" : "saved");
    } catch (error) {
      pending.current = { ...batch, ...pending.current };
      setStatus("error");
      toast.error(getErrorMessage(error, "Couldn't save your changes."));
    }
  }, [uid]);

  const update = useCallback(
    (patch: ProfileUpdate) => {
      pending.current = { ...pending.current, ...patch };
      setOverlay((o) => ({ ...o, ...patch }));
      setStatus("saving");
      clearTimeout(timer.current);
      timer.current = setTimeout(save, SAVE_DELAY);
    },
    [save],
  );

  // Remember this browser as the owner's so their own visits to their page aren't counted.
  useEffect(() => markOwnerBrowser(uid), [uid]);

  // Save straight away when leaving, and warn if the tab closes mid-save.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(pending.current).length) {
        save();
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      save();
    };
  }, [save]);

  const value = useMemo(
    () => ({ profile: { ...profile, ...overlay }, update, status, retry: save }),
    [profile, overlay, update, status, save],
  );
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside <DashboardProvider>");
  return ctx;
}

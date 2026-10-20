"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "@/firebase/firebase";
import { completeRedirectSignIn, subscribeToUserProfile, syncGooglePhoto } from "@/firebase/firebase-actions";
import type { UserProfile } from "@/lib/types";

type AuthState = {
  user: User | null;
  /** null while signed out, or signed in without a page yet. */
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
};

const AuthContext = createContext<AuthState>({ user: null, profile: null, loading: true, configured: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const synced = useRef<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    completeRedirectSignIn().catch(() => undefined);

    let stopProfile: (() => void) | undefined;
    const stopAuth = onAuthStateChanged(firebaseAuth(), (nextUser) => {
      stopProfile?.();
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      stopProfile = subscribeToUserProfile(
        nextUser.uid,
        (nextProfile) => {
          setProfile(nextProfile);
          setLoading(false);
          // Refresh the stored Google photo once per session so it stays the default avatar.
          if (nextProfile && synced.current !== nextUser.uid) {
            synced.current = nextUser.uid;
            syncGooglePhoto(nextUser, nextProfile).catch(() => undefined);
          }
        },
        () => setLoading(false),
      );
    });

    return () => {
      stopAuth();
      stopProfile?.();
    };
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, configured: isFirebaseConfigured }),
    [user, profile, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

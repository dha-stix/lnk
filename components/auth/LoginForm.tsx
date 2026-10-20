"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { getErrorMessage, getUserProfile, signInWithGoogle } from "@/firebase/firebase-actions";
import { AuthHeading } from "./AuthShell";
import { GoogleButton } from "./GoogleButton";
import { SetupNotice } from "./SetupNotice";

export function LoginForm() {
  const router = useRouter();
  const { user, profile, loading, configured } = useAuth();
  const [busy, setBusy] = useState(false);

  // Already signed in? Send them on.
  useEffect(() => {
    if (loading || !user) return;
    router.replace(profile ? "/dashboard" : "/auth/register?step=username");
  }, [loading, user, profile, router]);

  const login = async () => {
    setBusy(true);
    try {
      const signedIn = await signInWithGoogle();
      if (!signedIn) return; // Redirect flow takes over.
      const existing = await getUserProfile(signedIn.uid);
      if (existing) {
        toast.success(`Welcome back, ${existing.displayName.split(" ")[0] || existing.username}!`);
        router.replace("/dashboard");
      } else {
        router.replace("/auth/register?step=username");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      setBusy(false);
    }
  };

  return (
    <>
      <AuthHeading title="Welcome back." subtitle="Log in to edit your links and check your stats." />
      {configured ? (
        <GoogleButton onClick={login} loading={busy || (loading && Boolean(user))}>
          Continue with Google
        </GoogleButton>
      ) : (
        <SetupNotice />
      )}
      <p className="text-center text-sm text-muted">
        New to Lnk?{" "}
        <Link href="/auth/register" className="font-bold text-violet hover:underline">
          Create your page
        </Link>
      </p>
    </>
  );
}

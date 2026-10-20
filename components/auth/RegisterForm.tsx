"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { createUserProfile, getErrorMessage, getUserProfile, signInWithGoogle, signOutUser } from "@/firebase/firebase-actions";
import { siteHost } from "@/lib/site";
import { sanitizeUsernameInput } from "@/lib/username";
import { cn } from "@/lib/utils";
import { AuthHeading } from "./AuthShell";
import { GoogleButton } from "./GoogleButton";
import { SetupNotice } from "./SetupNotice";
import { UsernameField, type UsernameStatus } from "./UsernameField";

function StepDot({ n, state }: { n: number; state: "done" | "current" | "todo" }) {
  return (
    <span
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-bold transition-colors",
        state === "todo" ? "border border-line-strong text-muted" : "bg-ink text-white",
        state === "done" && "bg-success",
      )}
    >
      {state === "done" ? "✓" : n}
    </span>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, profile, loading, configured } = useAuth();
  const [username, setUsername] = useState(() => sanitizeUsernameInput(params.get("username") ?? ""));
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && profile) router.replace("/dashboard");
  }, [loading, user, profile, router]);

  const signedInWithoutPage = Boolean(user && !profile && !loading);
  const canSubmit = status === "available" && !busy;

  const finish = async (account = user) => {
    if (!account) return;
    const page = await createUserProfile(account, username);
    toast.success(`${siteHost}/@${page.username} is yours!`);
    router.replace("/dashboard");
  };

  const signUp = async () => {
    setBusy(true);
    try {
      if (signedInWithoutPage) {
        await finish();
        return;
      }
      const account = await signInWithGoogle();
      if (!account) return; // Redirect flow takes over.
      if (await getUserProfile(account.uid)) {
        toast.success("You already have a page. Welcome back!");
        router.replace("/dashboard");
        return;
      }
      await finish(account);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setBusy(false);
    }
  };

  return (
    <>
      <ol className="flex items-center gap-2 text-[13px] text-muted" aria-label="Sign-up steps">
        <li className="flex items-center gap-2">
          <StepDot n={1} state={status === "available" ? "done" : "current"} />
          <span className="font-bold text-ink">Claim username</span>
        </li>
        <li aria-hidden className="h-px flex-1 bg-line-strong" />
        <li className="flex items-center gap-2">
          <StepDot n={2} state={signedInWithoutPage ? "done" : status === "available" ? "current" : "todo"} />
          <span className={status === "available" ? "font-bold text-ink" : undefined}>Connect Google</span>
        </li>
      </ol>

      <AuthHeading
        title={signedInWithoutPage ? "One last step." : "Create your Lnk."}
        subtitle={signedInWithoutPage ? "Pick the username for your page." : "Free, and it takes under a minute."}
      />

      <UsernameField value={username} onChange={setUsername} onStatusChange={setStatus} />

      {!configured ? (
        <SetupNotice />
      ) : signedInWithoutPage ? (
        <>
          <Button size="lg" onClick={signUp} loading={busy} disabled={!canSubmit} className="w-full rounded-2xl">
            Create my page
          </Button>
          <p className="text-center text-sm text-muted">
            Signed in as {user?.email}.{" "}
            <button type="button" onClick={() => signOutUser()} className="font-bold text-violet hover:underline">
              Use another account
            </button>
          </p>
        </>
      ) : (
        <GoogleButton tone="dark" onClick={signUp} loading={busy} disabled={!canSubmit}>
          Sign up with Google
        </GoogleButton>
      )}

      <p className="text-center text-sm text-muted">
        Already have a page?{" "}
        <Link href="/auth/login" className="font-bold text-violet hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}

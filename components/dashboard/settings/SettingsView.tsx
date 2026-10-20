"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { GoogleLogo } from "@/components/auth/GoogleButton";
import { UsernameField, type UsernameStatus } from "@/components/auth/UsernameField";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Panel } from "@/components/ui/Panel";
import { Toggle } from "@/components/ui/Toggle";
import { changeUsername, deleteAccount, getErrorMessage, signOutUser } from "@/firebase/firebase-actions";
import { siteHost } from "@/lib/site";
import type { ProfileSettings } from "@/lib/types";

function UsernameSettings() {
  const { profile } = useDashboard();
  const [value, setValue] = useState(profile.username);
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [busy, setBusy] = useState(false);
  const changed = value !== profile.username;

  const save = async () => {
    setBusy(true);
    try {
      const next = await changeUsername(profile.uid, profile.username, value);
      toast.success(`Your page now lives at ${siteHost}/@${next}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel title="Username" description="Changing it moves your page. Your old link will stop working.">
      <UsernameField value={value} onChange={setValue} onStatusChange={setStatus} current={profile.username} label="Your username" />
      <div className="flex justify-end">
        <Button onClick={save} loading={busy} disabled={!changed || status !== "available"} shape="rounded">
          Save username
        </Button>
      </div>
    </Panel>
  );
}

function PrivacySettings() {
  const { profile, update } = useDashboard();
  const set = (changes: Partial<ProfileSettings>) => update({ settings: { ...profile.settings, ...changes } });
  const rows: { key: keyof ProfileSettings; title: string; body: string }[] = [
    { key: "adultWarning", title: "18+ warning on adult links", body: "Visitors confirm their age before opening links like OnlyFans or Fansly." },
    { key: "indexable", title: "Show my page in search engines", body: "Let Google and others list your Lnk page." },
  ];
  return (
    <Panel title="Privacy">
      <ul className="flex flex-col divide-y divide-line">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
            <div>
              <div className="font-semibold">{row.title}</div>
              <div className="text-sm text-muted">{row.body}</div>
            </div>
            <Toggle checked={profile.settings[row.key]} onChange={(v) => set({ [row.key]: v })} label={row.title} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function AccountSettings() {
  const { profile } = useDashboard();
  const { user } = useAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    await signOutUser();
    router.replace("/");
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteAccount(profile);
      toast.success("Your account and page have been deleted.");
      router.replace("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete your account."));
      setBusy(false);
    }
  };

  return (
    <>
      <Panel title="Connected account">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line p-4">
          <div className="flex items-center gap-3">
            <GoogleLogo size={28} />
            <div>
              <div className="font-bold">Google</div>
              <div className="text-sm text-muted">{user?.email}</div>
            </div>
          </div>
          <span className="rounded-full bg-lime-soft px-3 py-1.5 text-[13px] font-bold text-success">Connected</span>
        </div>
      </Panel>

      <Panel className="border-[#F2C4C0]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-danger">Delete account</h2>
            <p className="text-sm text-muted">Removes your page, links and analytics for good.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="outline" shape="rounded" onClick={logout}>Log out</Button>
            <Button variant="danger" shape="rounded" onClick={() => setConfirming(true)} className="hover:animate-shake">
              Delete account
            </Button>
          </div>
        </div>
      </Panel>

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Delete your Lnk?" description="This can't be undone. Your username will become available to others.">
        <div className="flex flex-col gap-5">
          <TextField
            label={`Type ${profile.username} to confirm`}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
          />
          <p className="text-sm text-muted">You&apos;ll be asked to sign in with Google once more to confirm.</p>
          <div className="flex flex-wrap justify-end gap-2.5">
            <Button variant="outline" shape="rounded" onClick={() => setConfirming(false)}>Cancel</Button>
            <Button variant="danger" shape="rounded" loading={busy} disabled={typed.trim().toLowerCase() !== profile.username} onClick={remove}>
              Delete forever
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function SettingsView() {
  return (
    <>
      <UsernameSettings />
      <PrivacySettings />
      <AccountSettings />
    </>
  );
}

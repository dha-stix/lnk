"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Avatar, avatarSrc } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { GoogleLogo } from "@/components/auth/GoogleButton";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { Spinner } from "@/components/ui/Spinner";
import { BIO_LIMIT, getErrorMessage, NAME_LIMIT, revertToGooglePhoto, uploadAvatar } from "@/firebase/firebase-actions";

export function ProfileEditor() {
  const { profile, update } = useDashboard();
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState<"upload" | "google" | null>(null);
  const usingGoogle = !profile.photoURL;

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const local = URL.createObjectURL(file);
    setPreview(local);
    setBusy("upload");
    try {
      await uploadAvatar(profile.uid, file);
      toast.success("Looking good! Photo updated.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't upload that photo."));
    } finally {
      setBusy(null);
      setPreview(null);
      URL.revokeObjectURL(local);
    }
  };

  const switchToGoogle = async () => {
    setBusy("google");
    try {
      await revertToGooglePhoto(profile.uid);
      toast.success("Switched back to your Google photo.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  return (
    <Panel title="Profile" description="This is the first thing visitors see.">
      <div className="flex flex-wrap items-center gap-5">
        <div className="relative">
          <Avatar src={preview ?? avatarSrc(profile)} name={profile.displayName || profile.username} size={92} className="border-2 border-ink" />
          {busy === "upload" && (
            <span className="absolute inset-0 grid place-items-center rounded-full bg-ink/50 text-white">
              <Spinner />
            </span>
          )}
          {usingGoogle && profile.googlePhotoURL && !preview && (
            <span className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-ink bg-white" title="Your Google photo">
              <GoogleLogo size={16} />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" shape="rounded" icon={<Icon name="upload" className="size-4" />} loading={busy === "upload"} onClick={() => fileInput.current?.click()}>
              Upload photo
            </Button>
            <Button size="sm" shape="rounded" variant="subtle" loading={busy === "google"} disabled={usingGoogle || !profile.googlePhotoURL} onClick={switchToGoogle}>
              Use Google photo
            </Button>
          </div>
          <span className="text-[13px] text-muted">
            {usingGoogle ? "Showing your Google photo. Upload one to replace it." : "JPG, PNG or WebP. We crop it to a square."}
          </span>
        </div>
        <input ref={fileInput} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={onFile} aria-label="Upload profile photo" />
      </div>

      <TextField
        label="Display name"
        value={profile.displayName}
        maxLength={NAME_LIMIT}
        onChange={(e) => update({ displayName: e.target.value })}
        placeholder="Your name"
      />
      <TextAreaField
        label="Bio"
        rows={3}
        value={profile.bio}
        maxLength={BIO_LIMIT}
        onChange={(e) => update({ bio: e.target.value })}
        placeholder="A line or two about you. Everyone can see this."
        counter={`${profile.bio.length} / ${BIO_LIMIT}`}
      />
    </Panel>
  );
}

import Image from "next/image";
import { cn, getInitials, trustedPhotoUrl } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
};

/** Shows the uploaded photo, else the Google photo, else initials. */
export function Avatar({ src, name, size = 88, className }: AvatarProps) {
  const local = src?.startsWith("blob:") || src?.startsWith("data:");
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-lime font-display text-ink", className)}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {src ? (
        <Image src={src} alt={`${name}'s profile photo`} fill sizes={`${size}px`} className="object-cover" unoptimized={local} referrerPolicy="no-referrer" />
      ) : (
        <span aria-hidden>{getInitials(name)}</span>
      )}
    </span>
  );
}

/** Uploaded photo, else Google photo; untrusted hosts are dropped so initials show instead. */
export const avatarSrc = (profile: { photoURL: string | null; googlePhotoURL: string | null }) =>
  trustedPhotoUrl(profile.photoURL) ?? trustedPhotoUrl(profile.googlePhotoURL);

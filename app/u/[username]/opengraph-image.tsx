import { profileImage } from "@/components/og/OgImages";
import { fetchPublicProfile } from "@/firebase/firebase-actions";

export const alt = "Lnk profile: all their links in one place";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Built per user at request time, so name, photo, theme and view count stay current.
export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return profileImage(await fetchPublicProfile(username));
}

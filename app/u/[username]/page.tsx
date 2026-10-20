import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { PublicProfile } from "@/components/profile/PublicProfile";
import { fetchPublicProfile } from "@/firebase/firebase-actions";
import { profilePath } from "@/lib/site";

// Shared by generateMetadata and the page so the profile is fetched once per request.
const loadProfile = cache(fetchPublicProfile);

export async function generateMetadata({ params }: PageProps<"/u/[username]">): Promise<Metadata> {
  const { username } = await params;
  const data = await loadProfile(username);
  if (!data) return { title: "Page not found" };
  const { profile } = data;
  const name = profile.displayName || `@${profile.username}`;
  const description = profile.bio.replace(/\s*\n+\s*/g, " · ") || `All of ${name}'s links in one place.`;
  // Preview images come from opengraph-image.tsx / twitter-image.tsx beside this page.
  return {
    title: `${name} (@${profile.username})`,
    description,
    alternates: { canonical: profilePath(profile.username) },
    robots: profile.settings.indexable ? undefined : { index: false, follow: false },
    openGraph: { title: `${name} on Lnk`, description, url: profilePath(profile.username), type: "profile", siteName: "Lnk" },
    twitter: { card: "summary_large_image", title: `${name} on Lnk`, description },
  };
}

async function ProfileLoader({ params }: Pick<PageProps<"/u/[username]">, "params">) {
  const { username } = await params;
  const data = await loadProfile(username);
  if (!data) notFound();
  // Set by Vercel at the edge; absent locally.
  const country = (await headers()).get("x-vercel-ip-country");
  return <PublicProfile {...data} country={country} />;
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center gap-4 px-5 pt-24" aria-busy="true" aria-label="Loading page">
      <div className="skeleton size-28 rounded-full" />
      <div className="skeleton h-8 w-48 rounded-xl" />
      <div className="skeleton h-4 w-24 rounded-lg" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-14 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export default function PublicProfilePage({ params }: PageProps<"/u/[username]">) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileLoader params={params} />
    </Suspense>
  );
}

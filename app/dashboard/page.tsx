import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { ProfileEditor } from "@/components/dashboard/links/ProfileEditor";
import { SocialLinksEditor } from "@/components/dashboard/links/SocialLinksEditor";
import { WebsitesEditor } from "@/components/dashboard/links/WebsitesEditor";

export const instant = false;

export const metadata: Metadata = { title: "Links" };

export default function LinksPage() {
  return (
    <DashboardPage title="Your links" description="Changes save automatically and show up instantly." preview>
      <ProfileEditor />
      <SocialLinksEditor />
      <WebsitesEditor />
    </DashboardPage>
  );
}

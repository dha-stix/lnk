import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { SettingsView } from "@/components/dashboard/settings/SettingsView";

export const instant = false;

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <DashboardPage title="Settings" description="Your username, privacy and account.">
      <SettingsView />
    </DashboardPage>
  );
}

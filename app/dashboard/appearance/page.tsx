import type { Metadata } from "next";
import { AppearanceEditor } from "@/components/dashboard/appearance/AppearanceEditor";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export const instant = false;

export const metadata: Metadata = { title: "Appearance" };

export default function AppearancePage() {
  return (
    <DashboardPage title="Appearance" description="Make your page unmistakably yours." preview>
      <AppearanceEditor />
    </DashboardPage>
  );
}

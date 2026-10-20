import type { Metadata } from "next";
import { AnalyticsView } from "@/components/dashboard/analytics/AnalyticsView";
import { DashboardPage } from "@/components/dashboard/DashboardPage";

export const instant = false;

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <DashboardPage title="Analytics" description="Who's visiting, from where, and what they tap.">
      <AnalyticsView />
    </DashboardPage>
  );
}

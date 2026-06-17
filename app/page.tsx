import { Dashboard } from "@/components/Dashboard";
import { buildBriefing, summarizeAvailableDays } from "@/lib/briefing";

export const revalidate = 1800;

export default async function HomePage() {
  const now = new Date();
  const briefing = await buildBriefing(now);
  const availableDays = summarizeAvailableDays(now);
  return <Dashboard initial={briefing} availableDays={availableDays} />;
}

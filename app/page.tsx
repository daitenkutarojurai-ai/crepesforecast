import { Dashboard } from "@/components/Dashboard";
import { buildBriefing } from "@/lib/briefing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const briefing = await buildBriefing(new Date());
  return <Dashboard initial={briefing} />;
}

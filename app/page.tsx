import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getClientsWithoutService, getCensusData, getSystemOverview } from "@/lib/stats";
import HelpPR from "@/components/HelpPR";
import Petitions from "@/components/Petitions";
import { Census } from "@/components/Census";
import { OutageDataProvider } from "@/components/OutageDataProvider";
import { GridHealth } from "@/components/GridHealth";

export default async function Home() {
  const [clients, census, system] = await Promise.all([
    getClientsWithoutService(),
    getCensusData(),
    getSystemOverview(),
  ]);

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <OutageDataProvider fallbackData={clients ?? undefined} />
        <GridHealth fallbackData={system ?? undefined} />
        {census && <Census data={census} />}
        <HelpPR />
        <Petitions />
      </main>
      <Footer />
    </div>
  );
}

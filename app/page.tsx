import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getClientsWithoutService, getCensusData, getSystemOverview } from "@/lib/stats";
import HelpPR from "@/components/HelpPR";
import Petitions from "@/components/Petitions";
import { Census } from "@/components/Census";
import { OutageDataProvider } from "@/components/OutageDataProvider";
import { GridHealth } from "@/components/GridHealth";
import { History } from "@/components/History";
import { getHistory } from "@/lib/db/snapshots";
import { FAQ } from "@/components/FAQ";
import { JsonLd } from "@/components/JsonLd";
import { cookies, headers } from "next/headers";
import { LANG_COOKIE, isLang, type Lang } from "@/lib/lang";

export default async function Home() {
  const fromProxy = (await headers()).get("x-lang");
  const cookieLang = (await cookies()).get(LANG_COOKIE)?.value;
  const lang: Lang = isLang(fromProxy) ? fromProxy : isLang(cookieLang) ? cookieLang : "es";

  const [clients, census, system, history] = await Promise.all([
    getClientsWithoutService(),
    getCensusData(),
    getSystemOverview(),
    getHistory("7d"),
  ]);

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <JsonLd lang={lang} outage={clients} historySince={history?.since ?? null} />
      <Header />
      <main className="flex-1">
        <OutageDataProvider fallbackData={clients ?? undefined} />
        <GridHealth fallbackData={system ?? undefined} />
        {history && <History fallbackData={history} />}
        {census && <Census data={census} />}
        <FAQ outage={clients} />
        <HelpPR />
        <Petitions />
      </main>
      <Footer />
    </div>
  );
}

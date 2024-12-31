import React from "react";
import { TotalStatsPR } from "../components/TotalStatsPR";
import { Footer } from "../components/Footer";
import { ArrowDown } from "react-feather";
import { getOutage } from "@/lib/stats";
import HelpPR from "@/components/HelpPR";
import PovertyData from "@/components/PovertyData";
import WageData from "@/components/WageData";
import Petitions from "@/components/Petitions";
import { PuertoRicoMap } from "@/components/PuertoRicoMap";

export default async function Home() {
  const outages = await getOutage();

  return (
    <div className="">
      <div className="min-h-screen w-full flex justify-center items-center mb-4 bg-hero bg-cover">
        <div className="text-white p-6 lg:p-0">
          <h1 className="text-6xl md:text-8xl text-center">
            Apagón <span className="text-blue-600">Puerto</span>
            <span className="text-red-500">Rico</span>
          </h1>
          <div className="absolute bottom-5 left-1/2">
            <ArrowDown className="animate-bounce" />
          </div>
        </div>
      </div>

      <main className="flex w-full flex-col items-center justify-center text-center py-10">
        <TotalStatsPR
          totalStats={outages?.totals}
          regions={outages?.regions}
          timestamp={outages?.timestamp || ""}
        />
        <PuertoRicoMap regions={outages?.regions || []} />
        <HelpPR />
        <Petitions />
      </main>
      <Footer />
    </div>
  );
}

import type { NextPage } from "next";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { TOWNS } from "../towns";
import { Regions, Totals, Towns } from "../types";
import { AreaChartPR } from "../components/AreaChartPR";
import { TotalStatsPR } from "../components/TotalStatsPR";
import { PieChartPR } from "../components/PieChartPR";
import { Petitions } from "../components/Petitions";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { toTitleCase } from "../utils";
import HelpPR from "../components/HelpPR";

const Home: NextPage = () => {
  const [regions, setRegions] = useState<Regions[] | undefined>(undefined);
  const [totalStats, setTotalStats] = useState<Totals | undefined>(undefined);
  const [towns, setTowns] = useState<Towns | undefined>(undefined);

  const getRegionOutages = async () => {
    const res = await axios.get(
      "https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService"
    );

    setRegions(res.data.regions);
    setTotalStats(res.data.totals);
    return res;
  };

  const getTownOutages = async () => {
    const res = await axios.post(
      "https://api.miluma.lumapr.com/miluma-outage-api/outage/municipality/towns",
      TOWNS
    );

    setTowns(res.data);
    return res;
  };

  useEffect(() => {
    // Fetch data for towns and regions endpoints
    getRegionOutages();
    getTownOutages();
  }, []);

  const pieChartData = useMemo(() => {
    const data =
      towns &&
      Object.entries(towns).map(([key, value]) => {
        const obj = {
          name: toTitleCase(key),
          size: value.length,
        };

        return obj;
      });

    return data;
  }, [towns]);

  return (
    <div className="flex w-screen min-w-fit min-h-screen flex-col bg-black text-white items-center justify-center p-6 md:p-0">
      <Seo />

      <main className="flex w-full flex-col items-center justify-center text-center py-10">
        <h1 className="text-4xl mb-4 w-[50rem]">
          Service Interruptions Reported by LUMA / Interrupciones de Servicio
          Reportado por LUMA
        </h1>
        <AreaChartPR regions={regions} />
        <TotalStatsPR totalStats={totalStats} />

        <h2 className="text-2xl my-6 w-[50rem]">
          Total Zones Affected Per Municipalities of Puerto Rico / Total Zonas
          Afectadas Por Municipios de Puerto Rico
        </h2>
        <PieChartPR pieChartData={pieChartData} />
        <Petitions />
        <HelpPR />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

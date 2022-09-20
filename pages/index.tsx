import type { GetServerSideProps, NextPage } from "next";
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

const Home = ({
  outages,
  towns,
}: {
  outages: {
    regions: Regions[];
    totals: Totals;
  };
  towns: Towns;
}) => {
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
    <div className="flex w-full min-h-screen flex-col bg-black text-white items-center justify-center p-6 md:p-0">
      <Seo />

      <main className="flex w-full flex-col items-center justify-center text-center py-10">
        <h1 className="text-2xl md:text-4xl mb-4">
          Service Interruptions Reported by LUMA / Interrupciones de Servicio
          Reportado por LUMA
        </h1>
        <AreaChartPR regions={outages.regions} />
        <TotalStatsPR totalStats={outages.totals} />

        <h2 className="text-xl md:text-2xl my-6">
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data: outages } = await axios.get(
    "https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService"
  );

  const { data } = await axios.post(
    "https://api.miluma.lumapr.com/miluma-outage-api/outage/municipality/towns",
    TOWNS
  );

  return {
    props: {
      outages: outages,
      towns: data,
    },
  };
};

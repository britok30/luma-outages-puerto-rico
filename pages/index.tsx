import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { TOWNS } from "../towns";
import { News, Regions, Totals, Towns } from "../types";
import { AreaChartPR } from "../components/AreaChartPR";
import { TotalStatsPR } from "../components/TotalStatsPR";
import { PieChartPR } from "../components/PieChartPR";
import { Petitions } from "../components/Petitions";
import { Footer } from "../components/Footer";
import { NewsComponent } from "../components/NewsComponent";
import { Seo } from "../components/Seo";
import { toTitleCase } from "../utils";
import HelpPR from "../components/HelpPR";
import Image from "next/image";

const Home = ({
  outages,
  towns,
  news,
}: {
  outages: {
    regions: Regions[];
    totals: Totals;
  };
  towns: Towns;
  news: News;
}) => {
  const { entries: newsEntries } = news;
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
        <header>
          <div className="h-screen flex justify-center items-center mb-10">
            <div className="text-white">
              <h1 className="text-6xl md:text-8xl font-serif">
                Apagón
                <div>
                  <span className="text-blue-500">Puerto</span>{" "}
                  <span className="text-red-400">Rico</span>
                </div>
              </h1>
            </div>
            <Image
              className="opacity-30"
              src="/hero.jpg"
              alt="hero-img-puerto-rico"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </header>
        <h2 className="text-xl md:text-2xl mb-4">
          Service Interruptions Reported by LUMA | Interrupciones de Servicio
          Reportado por LUMA
        </h2>
        <AreaChartPR regions={outages.regions} />
        <TotalStatsPR totalStats={outages.totals} regions={outages.regions} />

        <h2 className="text-xl md:text-2xl my-6">
          Total Zones Affected Per Municipalities of Puerto Rico | Total Zonas
          Afectadas Por Municipios de Puerto Rico
        </h2>
        <PieChartPR pieChartData={pieChartData} />
        <Petitions />
        {/* News Component was experimental and I have a limit on the API */}
        {/* <NewsComponent newsEntries={newsEntries} /> */}
        <HelpPR />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: outages } = await axios.get(
    "https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService"
  );

  const { data } = await axios.post(
    "https://api.miluma.lumapr.com/miluma-outage-api/outage/municipality/towns",
    TOWNS
  );

  const { data: news } = await axios.get(
    "https://google-search3.p.rapidapi.com/api/v1/news/q=puerto+rico+luma",
    {
      headers: {
        "X-User-Agent": "desktop",
        "X-Proxy-Location": "EU",
        "X-RapidAPI-Key": "ad5d8d4b9fmsh6afde80d45081c7p106fb9jsnef296f3c0c38",
        "X-RapidAPI-Host": "google-search3.p.rapidapi.com",
      },
    }
  );

  return {
    props: {
      outages: outages,
      towns: data,
      news: news,
    },
  };
};

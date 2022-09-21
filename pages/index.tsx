import type { GetServerSideProps } from "next";
import React, { useMemo } from "react";
import axios from "axios";
import { TOWNS } from "../towns";
import { Regions, Totals, Towns, Wages } from "../types";
import { AreaChartPR } from "../components/AreaChartPR";
import { TotalStatsPR } from "../components/TotalStatsPR";
import { BarChartPR } from "../components/BarChartPR";
import { Petitions } from "../components/Petitions";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { toTitleCase } from "../utils";
import HelpPR from "../components/HelpPR";
import Image from "next/image";
import { ArrowDown } from "react-feather";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WAGE_COLORS } from "../constants";

const Home = ({
  outages,
  towns,
  wageData,
}: {
  outages: {
    regions: Regions[];
    totals: Totals;
  };
  towns: Towns;
  wageData: Wages;
}) => {
  const barChartData = useMemo(() => {
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
          <div className="h-screen flex justify-center items-center mb-4">
            <div className="text-white">
              <h1 className="text-6xl md:text-8xl font-serif">
                Apagón
                <div>
                  <span className="text-blue-500">Puerto</span>{" "}
                  <span className="text-red-400">Rico</span>
                </div>
              </h1>
              <ArrowDown className="block mt-8 mx-auto animate-bounce" />
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
        <BarChartPR barChartData={barChartData} />
        <Petitions />

        <h2 className="text-xl md:text-2xl my-6">
          Wage Distribution in Puerto Rico | Distribución de salarios en Puerto
          Rico
        </h2>
        <div className="w-full h-[200px] md:w-3/4 md:h-[500px]">
          <ResponsiveContainer>
            <BarChart
              data={wageData.data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Wage Bin" stroke="#FFC4C4" />
              <YAxis
                dataKey="Total Population"
                yAxisId="left"
                orientation="left"
                stroke="#EE6983"
              />
              <Tooltip
                cursor={false}
                itemStyle={{
                  color: "#EE6983",
                }}
              />

              <Bar yAxisId="left" dataKey="Total Population" fill="#82ca9d">
                {wageData.data?.map((_, index) => (
                  <Cell
                    key={index}
                    fill={WAGE_COLORS[index % WAGE_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400">
            Data from the {wageData.source[0].annotations.source_name}{" "}
            {wageData.source[0].annotations.dataset_name}
          </p>
        </div>

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

  const { data: wageData } = await axios.get(
    "https://datausa.io/api/data?Geography=04000US72&measure=Total%20Population,Total%20Population%20MOE%20Appx,Record%20Count&drilldowns=Wage%20Bin&Workforce%20Status=true&Record%20Count>=5&year=latest"
  );

  return {
    props: {
      outages: outages,
      towns: data,
      wageData,
    },
  };
};

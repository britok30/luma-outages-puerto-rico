import type { GetServerSideProps } from "next";
import React, { useMemo, useState } from "react";
import axios from "axios";
import { TOWNS } from "../towns";
import { Poverty, Regions, Totals, Towns, Wages } from "../types";
import { AreaChartPR } from "../components/AreaChartPR";
import { TotalStatsPR } from "../components/TotalStatsPR";
import { Petitions } from "../components/Petitions";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import HelpPR from "../components/HelpPR";
import Image from "next/image";
import { ArrowDown } from "react-feather";
import { WageBarChart } from "../components/WageBarChart";
import { ZonesTreeMap } from "../components/ZonesTreeMap";
import { PovertyTreeMap } from "../components/PovertyTreeMap";
import { PuertoRicoMap } from "../components/PuertoRicoMap";

const Home = ({
  outages,
  towns,
  wages,
  poverty,
}: {
  outages: {
    regions: Regions[];
    totals: Totals;
    timestamp: string;
  };
  towns: Towns;
  wages: Wages;
  poverty: Poverty;
}) => {
  const [hydrated, setHydrated] = useState<boolean>(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

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
              priority={true}
            />
          </div>
        </header>
        <TotalStatsPR
          totalStats={outages.totals}
          regions={outages.regions}
          timestamp={outages.timestamp}
        />
        <PuertoRicoMap regions={outages.regions} />
        <>
          <h2 className="text-xl md:text-2xl mt-14 mb-4">
            Service Interruptions Reported by LUMA | Interrupciones de Servicio
            Reportado por LUMA
          </h2>
          <AreaChartPR regions={outages.regions} />
        </>

        <>
          <h2 className="text-xl md:text-2xl my-6">
            Total Zones Affected Per Municipalities of Puerto Rico | Total Zonas
            Afectadas Por Municipios de Puerto Rico
          </h2>
          <ZonesTreeMap towns={towns} />
        </>

        <>
          <h2 className="text-xl md:text-2xl my-6">
            Wage Distribution in Puerto Rico | Distribución de Salarios en
            Puerto Rico
          </h2>
          <WageBarChart wages={wages} />
        </>

        <>
          <h2 className="text-xl md:text-2xl my-6">
            Poverty by Age and Sex | Pobreza por Edad y Sexo
          </h2>
          <PovertyTreeMap poverty={poverty} />
          <p className="w-full md:w-2/3 lg:w-1/3 text-left text-xs mt-5">
            The Census Bureau uses a set of money income thresholds that vary by
            family size and composition to determine who classifies as
            impoverished. If a family's total income is less than the family's
            threshold than that family and every individual in it is considered
            to be living in poverty.
          </p>
          <p className="w-full md:w-2/3 lg:w-1/3 text-left text-xs mt-5">
            La Oficina del Censo utiliza un conjunto de umbrales de ingresos
            monetarios que varían según el tamaño y la composición de la familia
            para determinar quién se clasifica como empobrecido. Si el ingreso
            total de una familia es menor que el umbral de la familia, se
            considera que esa familia y todos sus miembros viven en la pobreza.
          </p>
        </>
        <HelpPR />
        <Petitions />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { data: outages } = await axios.get(
    "https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService"
  );

  const { data: towns } = await axios.post(
    "https://api.miluma.lumapr.com/miluma-outage-api/outage/municipality/towns",
    TOWNS
  );

  const { data: wages } = await axios.get(
    "https://datausa.io/api/data?Geography=04000US72&measure=Total%20Population,Total%20Population%20MOE%20Appx,Record%20Count&drilldowns=Wage%20Bin&Workforce%20Status=true&Record%20Count>=5&year=latest"
  );

  const { data: poverty } = await axios.get(
    "https://datausa.io/api/data?Geography=04000US72&drilldowns=Age,Gender&measure=Poverty%20Population,Poverty%20Population%20Moe&Poverty%20Status=0&year=latest"
  );

  return {
    props: {
      outages,
      towns,
      wages,
      poverty,
    },
  };
};

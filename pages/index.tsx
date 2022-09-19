import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { TOWNS } from "../towns";
import { Regions } from "../types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home: NextPage = () => {
  const [regions, setRegions] = useState<Regions[] | undefined>(undefined);
  const [towns, setTowns] = useState<any | null>(null);

  const getRegionOutages = async () => {
    const res = await axios.get(
      "https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService"
    );
    setRegions(res.data.regions);
    console.log(res);
    return res;
  };

  const getTownOutages = async () => {
    const res = await axios.post(
      "https://api.miluma.lumapr.com/miluma-outage-api/outage/municipality/towns",
      TOWNS
    );
    setTowns(res);
    console.log(res);
    return res;
  };

  useEffect(() => {
    // Fetch data for towns and regions endpoints
    getRegionOutages();
    getTownOutages();
  }, []);

  const getCurrentDate = () => {
    const date = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return `Updated on: ${date}`;
  };

  return (
    <div className="flex w-full min-w-full min-h-screen flex-col bg-black text-white items-center justify-center py-2">
      <Head>
        <title>Apagones en Puerto Rico</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl mb-4 w-[50rem]">
          Service Interruptions Reported by LUMA / Interrupciones de Servicio
          Reportado por LUMA
        </h1>
        <ResponsiveContainer width="75%" height={500}>
          <AreaChart
            data={regions}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis stroke="white" dataKey="name" />
            <YAxis stroke="white" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="totalClients"
              name="Total Clients"
              stroke="#FF4A4A"
              fill="#FF4A4A"
            />
            <Area
              type="monotone"
              dataKey="totalClientsWithoutService"
              name="Total Clients Without Service"
              stroke="#FF9551"
              fill="#FF9551"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="mt-1 font-light">{getCurrentDate()}</p>
        <div className="mt-10">
          <h2 className="text-2xl mb-2">Petitions / Peticiones</h2>
          <a
            className="hover:underline"
            href="https://www.change.org/p/cancelacion-contrato-luma-puerto-rico?original_footer_petition_id=815564&algorithm=promoted&source_location=petition_footer&grid_position=1&pt=AVBldGl0aW9uABDcCgIAAAAAYxMkAnvsIz83ZTJjNzYyYg%3D%3D"
          >
            Cancelacion Contrato Luma Puerto Rico
          </a>
        </div>
      </main>

      <footer className="flex text-sm flex-col h-24 w-full items-center justify-center">
        <p>Built by Kelvin Brito</p>
        <p>Not affiliated with the Puerto Rican Government or LUMA Energy.</p>
        <p>No está afiliado con el Gobierno de Puerto Rico o LUMA Energy.</p>
        <a
          className="underline mt-2"
          href="https://miluma.lumapr.com/outages/outageMap"
        >
          Original Data Source
        </a>
      </footer>
    </div>
  );
};

export default Home;

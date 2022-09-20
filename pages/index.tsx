import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { TOWNS } from "../towns";
import { Regions, Totals, Towns, ZoneArea } from "../types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
} from "recharts";

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

  const getCurrentDate = () => {
    const date = new Date().toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return `Updated on: ${date}`;
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const mapData = useMemo(() => {
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

  const COLORS = [
    "#FA7070",
    "#CD104D",
    "#87A2FB",
    "#8758FF",
    "#AF0171",
    "#F1A661",
    "#FF1E00",
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {mapData?.[index].name} ({mapData?.[index].size})
      </text>
    );
  };

  return (
    <div className="flex w-screen min-w-fit min-h-screen flex-col bg-black text-white items-center justify-center p-6 md:p-0">
      <Head>
        <title>Apagones en Puerto Rico</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-col items-center justify-center text-center">
        <h1 className="text-4xl mb-4 w-[50rem]">
          Service Interruptions Reported by LUMA / Interrupciones de Servicio
          Reportado por LUMA
        </h1>
        <div style={{ width: "100%", height: 500 }}>
          <ResponsiveContainer>
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
                stroke="#FF9551"
                fill="#FF9551"
              />
              <Area
                type="monotone"
                dataKey="totalClientsWithoutService"
                name="Total Clients Without Service"
                stroke="#FF4A4A"
                fill="#FF4A4A"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="my-6 border rounded-lg p-4">
          <h2 className="text-2xl text-blue-500 mb-2">Puerto Rico</h2>

          <div className="text-lg font-light text-left flex flex-col space-y-4">
            <div className="my-2 text-sm">
              <p className="text-red-400 text-4xl">
                {totalStats?.totalClientsWithoutService.toLocaleString() || "-"}
              </p>
              Total Clients Without Service in Puerto Rico
            </div>
            <div className="my-2 text-sm">
              <p className="text-red-400 text-4xl">
                {totalStats?.totalClients.toLocaleString() || "-"}
              </p>
              Total Clients in Puerto Rico
            </div>
            <div className="my-2 text-sm">
              <p className="text-red-400 text-4xl">
                {`${totalStats?.totalPercentage.toFixed(0)} %` || "-"}
              </p>
              Percentage of Clients without power
            </div>
          </div>
        </div>

        <h2 className="text-2xl my-6 w-[50rem]">
          Total Zones Affected Per Municipalities of Puerto Rico / Total Zonas
          Afectadas Por Municipios de Puerto Rico
        </h2>
        <ResponsiveContainer height={800}>
          <PieChart>
            <Pie
              dataKey="size"
              startAngle={360}
              endAngle={0}
              data={mapData}
              cx="50%"
              cy="50%"
              outerRadius={300}
              innerRadius={50}
              fill="#8884d8"
              paddingAngle={2}
              label={renderCustomizedLabel}
              isAnimationActive={false}
            >
              {mapData?.map((entry, index) => (
                <Cell fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="my-10 flex flex-col text-lg">
          <h2 className="text-2xl mb-2 text-red-400">
            Petitions / Peticiones via{" "}
            <a className="underline" href="https://www.change.org/">
              @Change
            </a>
          </h2>
          <a
            target="_blank"
            rel="no_referrer"
            className="hover:underline"
            href="https://www.change.org/p/cancelacion-contrato-luma-puerto-rico?original_footer_petition_id=815564&algorithm=promoted&source_location=petition_footer&grid_position=1&pt=AVBldGl0aW9uABDcCgIAAAAAYxMkAnvsIz83ZTJjNzYyYg%3D%3D"
          >
            Cancelacion Contrato Luma Puerto Rico
          </a>
          <a
            target="_blank"
            rel="no_referrer"
            className="hover:underline"
            href="https://www.change.org/p/gobernador-pedro-pierluisi-protect-puerto-rico-s-land?recruiter=1185529629&recruited_by_id=6b94ac90-8375-11eb-9f2b-69cd1d0deb8b&utm_source=share_petition&utm_medium=copylink&utm_campaign=petition_dashboard"
          >
            Protejamos las tierras de Puerto Rico
          </a>
        </div>
      </main>

      <footer className="flex text-md mt-20 mb-10 flex-col h-24 w-full items-center justify-center">
        <p className="text-blue-500 mb-2">Built by Brito</p>
        <p className="font-light mb-2">{getCurrentDate()}</p>
        <div className="text-red-400 text-xs">
          <p>Not affiliated with the Puerto Rican Government or LUMA Energy.</p>
          <p>No está afiliado con el Gobierno de Puerto Rico o LUMA Energy.</p>
        </div>

        <a
          className="underline mt-2 text-xs"
          href="https://miluma.lumapr.com/outages/outageMap"
          target="_blank"
          rel="no_referrer"
        >
          Original Data Source
        </a>
      </footer>
    </div>
  );
};

export default Home;

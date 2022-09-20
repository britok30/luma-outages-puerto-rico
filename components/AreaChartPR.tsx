import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Regions } from "../types";

export const AreaChartPR = ({ regions }: { regions?: Regions[] }) => {
  return (
    <div className="h-[500px] w-full md:w-1/2">
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
            name="Total Clients / Clientes Totales"
            stroke="#FF9551"
            fill="#FF9551"
          />
          <Area
            type="monotone"
            dataKey="totalClientsWithoutService"
            name="Without Service / Sin Servicio"
            stroke="#FF4A4A"
            fill="#FF4A4A"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

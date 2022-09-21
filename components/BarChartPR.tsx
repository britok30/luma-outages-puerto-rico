import React from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../constants";

export const BarChartPR = ({
  barChartData,
}: {
  barChartData?: { name: string; size: number }[];
}) => {
  return (
    <div className="w-full h-[200px] md:w-3/4 md:h-[500px]">
      <ResponsiveContainer>
        <ComposedChart
          data={barChartData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="size" barSize={20} fill="#8884d8">
            {barChartData?.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
          <Line type="monotone" dataKey="size" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

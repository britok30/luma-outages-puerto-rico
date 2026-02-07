"use client";

import { PovertyData as PovertyDataType } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ec4899"];

const PovertyData = ({ data }: { data: PovertyDataType }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Poverty in Puerto Rico
        </h2>
        <span className="text-sm text-gray-400">ACS {data.year}</span>
      </div>

      {/* Overview stat */}
      <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-red-500 p-5 mb-6">
        <p className="text-sm text-gray-500">Overall Poverty Rate</p>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-3xl font-bold tabular-nums">
            {data.overallRate}%
          </span>
          <span className="text-sm text-gray-400">
            {data.totalBelowPoverty.toLocaleString()} of{" "}
            {data.totalPopulation.toLocaleString()} people
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Poverty Rate by Group
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.groups}
            layout="horizontal"
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              domain={[0, 60]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value, _name, props) => [
                `${value}% (${(props.payload as { population: number }).population.toLocaleString()} people)`,
                "Poverty Rate",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {data.groups.map((_entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Source: U.S. Census Bureau, American Community Survey {data.year} 1-Year
        Estimates (Table S1701)
      </p>
    </div>
  );
};

export default PovertyData;

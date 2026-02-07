"use client";

import { EmploymentData as EmploymentDataType } from "@/lib/types";
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

const EmploymentData = ({ data }: { data: EmploymentDataType }) => {
  const chartData = [
    {
      label: "Labor Force\nParticipation",
      value: data.laborForceRate,
      color: "#3b82f6",
    },
    {
      label: "Employment\nRatio",
      value: data.employmentRatio,
      color: "#10b981",
    },
    {
      label: "Unemployment\nRate",
      value: data.unemploymentRate,
      color: "#ef4444",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Employment Status
        </h2>
        <span className="text-sm text-gray-400">ACS {data.year}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-blue-500 p-5">
          <p className="text-sm text-gray-500">Labor Force Participation</p>
          <p className="text-2xl font-bold tabular-nums mt-1">
            {data.laborForceRate}%
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-emerald-500 p-5">
          <p className="text-sm text-gray-500">Employment Ratio</p>
          <p className="text-2xl font-bold tabular-nums mt-1">
            {data.employmentRatio}%
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-red-500 p-5">
          <p className="text-sm text-gray-500">Unemployment Rate</p>
          <p className="text-2xl font-bold tabular-nums mt-1">
            {data.unemploymentRate}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Employment Indicators (Population 16+:{" "}
          {data.population16Plus.toLocaleString()})
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
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
              formatter={(value) => [`${value}%`, "Rate"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={80}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Source: U.S. Census Bureau, American Community Survey {data.year} 1-Year
        Estimates (Table S2301)
      </p>
    </div>
  );
};

export default EmploymentData;

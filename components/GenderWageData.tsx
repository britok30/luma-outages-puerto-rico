"use client";

import { GenderWageData as GenderWageDataType } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const GenderWageData = ({ data }: { data: GenderWageDataType }) => {
  const chartData = [
    {
      label: "Male",
      median: data.maleMedian,
      workers: data.maleWorkers,
    },
    {
      label: "Female",
      median: data.femaleMedian,
      workers: data.femaleWorkers,
    },
  ];

  const gap = data.femaleMedian - data.maleMedian;
  const gapLabel = gap >= 0 ? `+$${gap.toLocaleString()}` : `-$${Math.abs(gap).toLocaleString()}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Gender Wage Comparison | Comparación Salarial por Género
        </h2>
        <span className="text-sm text-gray-400">ACS {data.year}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-blue-500 p-5">
          <p className="text-sm text-gray-500">Male Median Earnings | Ingresos Medianos Masculinos</p>
          <p className="text-2xl font-bold tabular-nums mt-1">
            ${data.maleMedian.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1 tabular-nums">
            {data.maleWorkers.toLocaleString()} workers | trabajadores
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-pink-500 p-5">
          <p className="text-sm text-gray-500">Female Median Earnings | Ingresos Medianos Femeninos</p>
          <p className="text-2xl font-bold tabular-nums mt-1">
            ${data.femaleMedian.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1 tabular-nums">
            {data.femaleWorkers.toLocaleString()} workers | trabajadores
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-emerald-500 p-5">
          <p className="text-sm text-gray-500">Gender Gap | Brecha Salarial</p>
          <p className="text-2xl font-bold tabular-nums mt-1">{gapLabel}</p>
          <p className="text-xs text-gray-400 mt-1">
            Overall median | Mediana general: ${data.overallMedian.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Median Earnings by Sex | Ingresos Medianos por Sexo
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 13, fill: "#6b7280" }} />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [`$${Number(value).toLocaleString()}`, "Median Earnings | Ingresos Medianos"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />
            <Legend />
            <Bar
              dataKey="median"
              name="Median Earnings | Ingresos Medianos"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
              fill="#3b82f6"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Source | Fuente: U.S. Census Bureau, American Community Survey {data.year} 1-Year
        Estimates (Table B20017)
      </p>
    </div>
  );
};

export default GenderWageData;

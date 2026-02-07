"use client";

import { IncomeData as IncomeDataType } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const IncomeData = ({ data }: { data: IncomeDataType }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Household Income Distribution | Distribución de Ingresos del Hogar
        </h2>
        <span className="text-sm text-gray-400">ACS {data.year}</span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-blue-500 p-5">
          <p className="text-sm text-gray-500">Median Income | Ingreso Mediano</p>
          <p className="text-2xl font-bold tabular-nums mt-1">
            ${data.medianIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-indigo-500 p-5">
          <p className="text-sm text-gray-500">Mean Income | Ingreso Promedio</p>
          <p className="text-2xl font-bold tabular-nums mt-1">
            ${data.meanIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 border-l-4 border-l-emerald-500 p-5">
          <p className="text-sm text-gray-500">Total Households | Total de Hogares</p>
          <p className="text-2xl font-bold tabular-nums mt-1">
            {data.totalHouseholds.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Distribution by Income Bracket | Distribución por Nivel de Ingreso
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data.brackets}
            margin={{ top: 5, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Households | Hogares"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />
            <Bar
              dataKey="percentage"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Source | Fuente: U.S. Census Bureau, American Community Survey {data.year} 1-Year
        Estimates (Table S1901)
      </p>
    </div>
  );
};

export default IncomeData;

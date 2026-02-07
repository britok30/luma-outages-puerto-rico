"use client";

import { EducationData as EducationDataType } from "@/lib/types";
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

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"];

const EducationData = ({ data }: { data: EducationDataType }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Educational Attainment | Nivel Educativo
        </h2>
        <span className="text-sm text-gray-400">ACS {data.year}</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Population 25+ | Población 25+: {data.population25Plus.toLocaleString()}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data.levels}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              width={160}
            />
            <Tooltip
              formatter={(value, _name, props) => [
                `${value}% (${(props.payload as { count: number }).count.toLocaleString()} people | personas)`,
                "Attainment | Nivel",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]} maxBarSize={40}>
              {data.levels.map((_entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Source | Fuente: U.S. Census Bureau, American Community Survey {data.year} 1-Year
        Estimates (Table S1501)
      </p>
    </div>
  );
};

export default EducationData;

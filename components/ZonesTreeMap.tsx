import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../constants";
import { useWindowSize } from "../hooks";
import { Towns } from "../types";
import { toTitleCase } from "../utils";
import { UpdatedOn } from "./UpdatedOn";

interface CustomizedContentProps {
  root: any;
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: any;
  colors: string[];
  rank: number;
  name: string;
  size: string;
}

export const ZonesTreeMap = ({ towns }: { towns: Towns }) => {
  const { width } = useWindowSize();

  const zonesData = useMemo(() => {
    const data =
      towns &&
      Object.entries(towns).map(([key, value]) => {
        const obj = {
          name: toTitleCase(key),
          totalZones: value.length,
        };

        return obj;
      });

    return data;
  }, [towns]);

  return (
    <div className="w-full h-[700px] md:w-[80%] md:h-[700px] mb-20 md:mb-10">
      <ResponsiveContainer>
        <BarChart data={zonesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalZones" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      <UpdatedOn />
    </div>
  );
};

const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, colors, name, size } =
    props as CustomizedContentProps;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill:
            depth < 2
              ? colors[Math.floor((index / root.children.length) * 6)]
              : "none",
          stroke: "#fff",
          strokeWidth: 1 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 ? (
        <text
          className="text-sm font-thin"
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
        >
          {name}
        </text>
      ) : null}
      {depth === 1 ? (
        <text
          className="font-light text-xs"
          x={x + 4}
          y={y + 18}
          fill="#fff"
          fontSize={16}
          fillOpacity={0.9}
        >
          {size}
        </text>
      ) : null}
    </g>
  );
};

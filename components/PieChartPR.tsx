import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export const PieChartPR = ({
  pieChartData,
}: {
  pieChartData?: { name: string; size: number }[];
}) => {
  const COLORS = [
    "#FA7070",
    "#CD104D",
    "#87A2FB",
    "#8758FF",
    "#AF0171",
    "#F1A661",
    "#FF1E00",
  ];

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
    const RADIAN = Math.PI / 180;
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
        {pieChartData?.[index].name} ({pieChartData?.[index].size})
      </text>
    );
  };

  return (
    <div className="h-[800px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="size"
            startAngle={360}
            endAngle={0}
            data={pieChartData}
            cx="50%"
            cy="50%"
            outerRadius={300}
            innerRadius={50}
            fill="#8884d8"
            paddingAngle={2}
            label={renderCustomizedLabel}
            isAnimationActive={false}
          >
            {pieChartData?.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

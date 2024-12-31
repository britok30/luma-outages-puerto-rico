"use client";

import React, { useMemo } from "react";
import { Regions, Totals } from "../lib/types";
import { UpdatedOn } from "./UpdatedOn";
import { CSVLink } from "react-csv";
import { Card } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  variant?: "success" | "danger" | "info";
}

const StatCard = ({
  title,
  value,
  change,
  variant = "info",
}: StatCardProps) => {
  const variants = {
    success: "bg-green-50 text-green-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between">
        <p className="text-gray-500 text-sm">{title}</p>
        {change && (
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full ${variants[variant]}`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </Card>
  );
};

const RegionCard = ({ region }: { region: Regions }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-medium">{region.name}</h3>
      <span className="text-xs px-3 py-1 bg-red-100 text-red-800 rounded-full">
        {region.percentageClientsWithoutService.toFixed(0)}% affected
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-red-500 h-2 rounded-full"
        style={{ width: `${region.percentageClientsWithoutService}%` }}
      />
    </div>
  </div>
);

export const TotalStatsPR = ({
  totalStats,
  regions = [],
  timestamp = "",
}: {
  totalStats?: Totals;
  regions?: Regions[];
  timestamp: string;
}) => {
  const stats = useMemo(() => {
    if (!totalStats) return null;

    return {
      withoutService: {
        value: totalStats.totalClientsWithoutService?.toLocaleString() || "-",
        percentage: totalStats.totalPercentageWithoutService?.toFixed(0),
      },
      withService: {
        value: totalStats.totalClientsWithService?.toLocaleString() || "-",
        percentage: totalStats.totalPercentageWithService?.toFixed(0),
      },
      total: totalStats.totalClients?.toLocaleString() || "-",
    };
  }, [totalStats]);

  const csvData = useMemo(() => {
    if (!stats) return [];
    return [
      ["Timestamp", "Clients Without Service", "Clients With Service", "Total"],
      [
        timestamp,
        stats.withoutService.value,
        stats.withService.value,
        stats.total,
      ],
    ];
  }, [stats, timestamp]);

  return (
    <div className="space-y-8 mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Puerto Rico Power Status</h2>
        {csvData.length > 0 && (
          <CSVLink
            data={csvData}
            filename="power-status.csv"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Data
          </CSVLink>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Without Service"
          value={stats.withoutService.value}
          change={`${stats.withoutService.percentage}%`}
          variant="danger"
        />
        <StatCard
          title="With Service"
          value={stats.withService.value}
          change={`${stats.withService.percentage}%`}
          variant="success"
        />
        <StatCard title="Total Clients" value={stats.total} variant="info" />
      </div>

      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Regional Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region) => (
            <RegionCard key={region.name} region={region} />
          ))}
        </div>
      </div>

      <footer className="text-sm text-gray-500 space-y-2">
        <UpdatedOn timestamp={timestamp} />
        <p>Data provided by LUMA. Values are approximate estimates.</p>
      </footer>
    </div>
  );
};

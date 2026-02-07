"use client";

import { useMemo } from "react";
import { Regions, Totals } from "../lib/types";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  variant?: "success" | "danger" | "info";
}

const variantAccents = {
  success: "border-emerald-500",
  danger: "border-red-500",
  info: "border-blue-500",
};

const variantBadges = {
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

const StatCard = ({
  title,
  value,
  change,
  variant = "info",
}: StatCardProps) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 border-l-4 ${variantAccents[variant]} p-5`}
  >
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{title}</p>
      {change && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${variantBadges[variant]}`}
        >
          {change}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold mt-1 tabular-nums">{value}</p>
  </div>
);

export const RegionCard = ({ region }: { region: Regions }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium text-sm">{region.name}</h3>
      <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-full font-medium">
        {region.percentageClientsWithoutService.toFixed(1)}%
      </span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className="bg-red-500 h-1.5 rounded-full transition-all"
        style={{ width: `${region.percentageClientsWithoutService}%` }}
      />
    </div>
    <p className="text-xs text-gray-400 mt-2 tabular-nums">
      {region.totalClientsWithoutService.toLocaleString()} / {region.totalClients.toLocaleString()} clients
    </p>
  </div>
);

export const TotalStatsPR = ({
  totalStats,
  regions = [],
}: {
  totalStats?: Totals;
  regions?: Regions[];
  timestamp?: string;
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

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
};

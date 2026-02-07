"use client";

import useSWR from "swr";
import { Outage } from "@/lib/types";
import { TotalStatsPR, RegionCard } from "./TotalStatsPR";
import { PuertoRicoMap } from "./PuertoRicoMap";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const OutageDataProvider = ({
  fallbackData,
}: {
  fallbackData: Outage;
}) => {
  const { data: clients } = useSWR<Outage>("/api/outages", fetcher, {
    fallbackData,
    refreshInterval: 300000,
    revalidateOnFocus: true,
  });

  if (!clients) return null;

  const { totals, regions = [], timestamp } = clients;
  const withoutService =
    totals?.totalClientsWithoutService?.toLocaleString() || "-";
  const percentage =
    totals?.totalPercentageWithoutService?.toFixed(1) || "0";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Summary Banner */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="text-sm text-gray-500 mb-1">Clients Without Power | Clientes Sin Energía</p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold tabular-nums text-gray-900">
            {withoutService}
          </span>
          <span className="text-lg font-medium text-red-600 tabular-nums">
            {percentage}%
          </span>
        </div>
        {timestamp && (
          <p className="text-xs text-gray-400 mt-2">
            Updated | Actualizado: {timestamp}
          </p>
        )}
      </div>

      {/* Stat Cards */}
      <TotalStatsPR totalStats={totals} regions={regions} />

      {/* Map + Regional Breakdown side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        {/* Region List */}
        <div className="lg:col-span-2 space-y-3 lg:max-h-[500px] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-gray-50 py-1">
            Regional Breakdown | Desglose Regional
          </h3>
          {regions.map((region) => (
            <RegionCard key={region.name} region={region} />
          ))}
        </div>

        {/* Map */}
        <div className="lg:col-span-3 min-h-[400px] bg-white rounded-lg border border-gray-200 overflow-hidden">
          <PuertoRicoMap regions={regions} />
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Regions, Totals, WebStateRecord } from "../types";
import { UpdatedOn } from "./UpdatedOn";
import { CSVLink, CSVDownload } from "react-csv";
import { getCurrentDate } from "../utils";

export const TotalStatsPR = ({
  totalStats,
  regions,
  timestamp,
}: {
  totalStats?: Totals;
  regions?: Regions[];
  timestamp: string;
}) => {
  const energyStats = () => {
    if (!totalStats) return;

    const lumaTotalClients = totalStats.totalClients;
    const lumaWithoutEnergy = totalStats.totalClientsWithoutService;
    const lumaWithoutEnergyPercentage =
      totalStats.totalPercentageWithoutService;
    const lumaWithEnergy = totalStats.totalClientsWithService;
    const lumaWithEnergyPercentage = totalStats.totalPercentageWithService;

    return {
      lumaTotalClients,
      lumaWithoutEnergy,
      lumaWithoutEnergyPercentage,
      lumaWithEnergy,
      lumaWithEnergyPercentage,
      timestamp,
    };
  };

  const csvData = [
    [
      "Timestamp",
      "Total Clients Without Energy (LUMA)",
      "Total Clients With Energy (LUMA)",
      "Percentage of Clients Without Energy (LUMA)",
      "Percentage of Clients With Energy (LUMA)",
      "Total Clients (LUMA)",
    ],
    [
      `${timestamp}`,
      `${energyStats()?.lumaWithoutEnergy.toLocaleString()}`,
      `${energyStats()?.lumaWithEnergy.toLocaleString()}`,
      `${energyStats()?.lumaWithoutEnergyPercentage?.toFixed(0)}%`,
      `${energyStats()?.lumaWithEnergyPercentage?.toFixed(0)}%`,
      `${energyStats()?.lumaTotalClients.toLocaleString()}`,
    ],
  ];

  return (
    <div className="mb-10 border rounded-lg p-4 md:w-2/3">
      <h2 className="text-2xl md:text-4xl text-blue-500 mb-2">
        Ahora en Puerto Rico
      </h2>
      <div className="text-lg font-light text-left grid grid-cols-1 md:grid-cols-2 md:gap-x-5">
        <StatText
          stat={energyStats()?.lumaWithoutEnergy.toLocaleString() || "-"}
          text={
            "Total Clients Without Service (LUMA) | Clientes Totales Sin Servicio (LUMA)"
          }
        />

        <StatText
          stat={energyStats()?.lumaWithEnergy.toLocaleString() || "-"}
          text={
            "Total Clients With Service (LUMA) | Clientes Totales Sin Servicio (LUMA)"
          }
        />

        <StatText
          stat={
            `${energyStats()?.lumaWithoutEnergyPercentage?.toFixed(0)}%` || "-"
          }
          text={
            "Percentage of Clients Without Service (LUMA) | Porcentaje de Clientes Sin Servicio (LUMA)"
          }
        />

        <StatText
          stat={`${energyStats()?.lumaWithEnergyPercentage.toFixed(0)}%` || "-"}
          text={
            "Percentage of Clients With Service (LUMA) | Porcentaje de Clientes Con Servicio (LUMA)"
          }
        />

        {regions?.map((region, index) => (
          <div key={index} className="my-2 text-xs">
            <p
              className={
                index % 2
                  ? "text-red-400 text-xl md:text-2xl mb-1"
                  : "text-blue-500 text-xl md:text-2xl mb-1"
              }
            >
              {`${region.percentageClientsWithoutService.toFixed(0)}%` || "-"}
            </p>
            {`Percentage of Clients without power in ${region.name} | Porcentaje de Clientes sin energía en ${region.name}`}
          </div>
        ))}

        <StatText
          stat={energyStats()?.lumaTotalClients.toLocaleString() || "-"}
          text={
            "Total Clients in Puerto Rico | Clientes Totales en Puerto Rico"
          }
        />
      </div>
      <p className="text-xs mt-5 font-light">
        These numbers are based on the limited available information provided by
        LUMA. They are rough estimates.
      </p>
      <UpdatedOn timestamp={timestamp} />
      <CSVLink
        filename={"luma-data.csv"}
        className="text-sm underline"
        data={csvData}
      >
        Download CSV
      </CSVLink>
    </div>
  );
};

const StatText = ({ stat, text }: { stat: number | string; text: string }) => {
  return (
    <div className="my-2 text-xs">
      <p className="text-red-400 text-xl md:text-2xl mb-1">{stat}</p>
      <p>{text}</p>
    </div>
  );
};

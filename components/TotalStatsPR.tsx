import React from "react";
import { Regions, Totals, WebStateRecord } from "../types";
import { UpdatedOn } from "./UpdatedOn";

export const TotalStatsPR = ({
  totalStats,
  regions,
  webStateRecords,
}: {
  totalStats?: Totals;
  regions?: Regions[];
  webStateRecords?: WebStateRecord[];
}) => {
  const puertoRicoData = webStateRecords?.find(
    (record) => record.StateName === "Puerto Rico"
  );

  const energyStats = () => {
    if (!totalStats || !puertoRicoData) return;

    const lumaTotalClients = totalStats.totalClients;
    const lumaWithoutEnergy = totalStats.totalClientsWithoutService;
    const lumaWithoutEnergyPercentage = totalStats.totalPercentage;
    const lumaWithEnergy = lumaTotalClients - lumaWithoutEnergy;
    const lumaWithEnergyPercentage = (lumaWithEnergy / lumaTotalClients) * 100;

    const pOUSTotalClients = puertoRicoData.CustomerCount;
    const pOUSWithoutEnergy = puertoRicoData.OutageCount;
    const pOUSWithoutEnergyPercentage =
      (pOUSWithoutEnergy / pOUSTotalClients) * 100;
    const pOUSWithEnergy = pOUSTotalClients - pOUSWithoutEnergy;
    const pOUSWithEnergyPercentage = (pOUSWithEnergy / pOUSTotalClients) * 100;

    return {
      lumaTotalClients,
      lumaWithoutEnergy,
      lumaWithoutEnergyPercentage,
      lumaWithEnergy,
      lumaWithEnergyPercentage,
      pOUSTotalClients,
      pOUSWithoutEnergy,
      pOUSWithoutEnergyPercentage,
      pOUSWithEnergy,
      pOUSWithEnergyPercentage,
    };
  };

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
          stat={energyStats()?.pOUSWithoutEnergy.toLocaleString() || "-"}
          text={
            "Total Clients Without Service (PowerOutage.US) | Clientes Totales Sin Servicio (PowerOutage.US)"
          }
        />

        <StatText
          stat={energyStats()?.lumaWithEnergy.toLocaleString() || "-"}
          text={
            "Total Clients With Service (LUMA) | Clientes Totales Sin Servicio (LUMA)"
          }
        />

        <StatText
          stat={energyStats()?.pOUSWithEnergy.toLocaleString() || "-"}
          text={
            "Total Clients With Service (PowerOutage.US) | Clientes Totales Con Servicio (PowerOutage.US)"
          }
        />

        <StatText
          stat={
            `${energyStats()?.lumaWithoutEnergyPercentage.toFixed(0)}%` || "-"
          }
          text={
            "Percentage of Clients Without Service (LUMA) | Porcentaje de Clientes Sin Servicio (LUMA)"
          }
        />

        <StatText
          stat={
            `${energyStats()?.pOUSWithoutEnergyPercentage.toFixed(0)}%` || "-"
          }
          text={
            "Percentage of Clients Without Service (PowerOutage.US) | Porcentaje de Clientes Sin Servicio (PowerOutage.US)"
          }
        />

        <StatText
          stat={`${energyStats()?.lumaWithEnergyPercentage.toFixed(0)}%` || "-"}
          text={
            "Percentage of Clients With Service (LUMA) | Porcentaje de Clientes Con Servicio (LUMA)"
          }
        />

        <StatText
          stat={`${energyStats()?.pOUSWithEnergyPercentage.toFixed(0)}%` || "-"}
          text={
            "Percentage of Clients With Service (PowerOutage.US) | Porcentaje de Clientes Con Servicio (PowerOutage.US)"
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
        LUMA and PowerOutage.US. They are rough estimates.
      </p>
      <UpdatedOn />
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

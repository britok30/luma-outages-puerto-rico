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

  const calculatePercentage = () => {
    if (!puertoRicoData) return "-";

    const calc =
      (puertoRicoData.OutageCount / puertoRicoData.CustomerCount) * 100;

    return `${calc.toFixed(0)}%`;
  };
  return (
    <div className="my-6 border rounded-lg p-4 md:w-2/3 lg:w-1/3">
      <h2 className="text-2xl md:text-4xl text-blue-500 mb-2">
        Ahora en Puerto Rico
      </h2>

      <div className="text-lg font-light text-left grid grid-cols-1 md:grid-cols-2 md:gap-x-5">
        <StatText
          stat={totalStats?.totalClientsWithoutService.toLocaleString() || "-"}
          text={
            "Total Clients Without Service in Puerto Rico (LUMA) | Clientes Totales Sin Servicio en Puerto Rico (LUMA)"
          }
        />

        <StatText
          stat={puertoRicoData?.OutageCount.toLocaleString() || "-"}
          text={
            "Total Clients Without Service reported (PowerOutage.US) | Clientes Totales Sin Servicio (PowerOutage.US)"
          }
        />

        <StatText
          stat={totalStats?.totalClients.toLocaleString() || "-"}
          text={
            "Total Clients in Puerto Rico (LUMA) | Clientes Totales en Puerto Rico (LUMA)"
          }
        />

        <StatText
          stat={`${totalStats?.totalPercentage.toFixed(0)}%` || "-"}
          text={
            "Percentage of Clients without power (LUMA) | Porcentaje de Clientes sin energía (LUMA)"
          }
        />

        <StatText
          stat={calculatePercentage()}
          text={
            "Percentage of Clients without power (PowerOutage.US) | Porcentaje de Clientes sin energía (PowerOutage.US)"
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
      </div>
      <p className="text-xs mt-5 font-light">
        These numbers are based on the limited available information provided by
        LUMA
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

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
  return (
    <div className="my-6 border rounded-lg p-4 md:w-2/3 lg:w-1/3">
      <h2 className="text-2xl md:text-4xl text-blue-500 mb-2">
        Ahora en Puerto Rico
      </h2>

      <div className="text-lg font-light text-left grid grid-cols-1 md:grid-cols-2 md:gap-x-5">
        <div className="my-2 text-xs">
          <p className="text-red-400 text-xl md:text-2xl mb-1">
            {totalStats?.totalClientsWithoutService.toLocaleString() || "-"}
          </p>
          Total Clients Without Service in Puerto Rico | Clientes Totales Sin
          Servicio en Puerto Rico
        </div>
        <div className="my-2 text-xs">
          <p className="text-red-400 text-xl md:text-2xl mb-1">
            {puertoRicoData?.OutageCount || "-"}
          </p>
          Total Clients Without Service by PowerOutage.US | Clientes Totales Sin
          Servicio por PowerOutage.US
        </div>
        <div className="my-2 text-xs">
          <p className="text-blue-500 text-xl md:text-2xl mb-1">
            {totalStats?.totalClients.toLocaleString() || "-"}
          </p>
          Total Clients in Puerto Rico | Clientes Totales en Puerto Rico
        </div>
        <div className="my-2 text-xs">
          <p className="text-red-400 text-xl md:text-2xl mb-1">
            {`${totalStats?.totalPercentage.toFixed(0)}%` || "-"}
          </p>
          Percentage of Clients without power in Puerto Rico | Porcentaje de
          Clientes sin energía en Puerto Rico
        </div>
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
      <UpdatedOn />
    </div>
  );
};

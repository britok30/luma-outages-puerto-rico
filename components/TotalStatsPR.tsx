import React from "react";
import { Totals } from "../types";

export const TotalStatsPR = ({ totalStats }: { totalStats?: Totals }) => {
  return (
    <div className="my-6 border rounded-lg p-4 w-[500px] md:w-1/3">
      <h2 className="text-2xl text-blue-500 mb-2">Ahora en Puerto Rico</h2>

      <div className="text-lg font-light text-left flex flex-col space-y-4">
        <div className="my-2 text-sm">
          <p className="text-red-400 text-4xl mb-1">
            {totalStats?.totalClientsWithoutService.toLocaleString() || "-"}
          </p>
          Total Clients Without Service in Puerto Rico / Clientes Totales Sin
          Servicio en Puerto Rico
        </div>
        <div className="my-2 text-sm">
          <p className="text-red-400 text-4xl mb-1">
            {totalStats?.totalClients.toLocaleString() || "-"}
          </p>
          Total Clients in Puerto Rico / Clientes Totales en Puerto Rico
        </div>
        <div className="my-2 text-sm">
          <p className="text-red-400 text-4xl mb-1">
            {`${totalStats?.totalPercentage.toFixed(0)} %` || "-"}
          </p>
          Percentage of Clients without power / Porcentaje de Clientes sin
          energía
        </div>
      </div>
    </div>
  );
};

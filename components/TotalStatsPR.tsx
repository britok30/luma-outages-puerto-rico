import React from "react";
import { Totals } from "../types";

export const TotalStatsPR = ({ totalStats }: { totalStats?: Totals }) => {
  return (
    <div className="my-6 border rounded-lg p-4 w-[500px] md:w-1/3">
      <h2 className="text-2xl text-blue-500 mb-2">Puerto Rico</h2>

      <div className="text-lg font-light text-left flex flex-col space-y-4">
        <div className="my-2 text-sm">
          <p className="text-red-400 text-4xl">
            {totalStats?.totalClientsWithoutService.toLocaleString() || "-"}
          </p>
          Total Clients Without Service in Puerto Rico
        </div>
        <div className="my-2 text-sm">
          <p className="text-red-400 text-4xl">
            {totalStats?.totalClients.toLocaleString() || "-"}
          </p>
          Total Clients in Puerto Rico
        </div>
        <div className="my-2 text-sm">
          <p className="text-red-400 text-4xl">
            {`${totalStats?.totalPercentage.toFixed(0)} %` || "-"}
          </p>
          Percentage of Clients without power
        </div>
      </div>
    </div>
  );
};

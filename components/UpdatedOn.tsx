import React from "react";
import { getCurrentDate } from "../utils";

export const UpdatedOn = ({ timestamp }: { timestamp?: string }) => {
  return (
    <div className="text-xs mt-5 flex flex-col md:flex-row justify-center space-x-3">
      <a
        className="underline"
        href="https://miluma.lumapr.com/outages/outageMap"
        target="_blank"
        rel="no_referrer"
      >
        Original Data Source
      </a>
      {timestamp && <p className="font-light">Updated on: {timestamp}</p>}
    </div>
  );
};

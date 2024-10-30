import React from "react";

export const UpdatedOn = ({ timestamp }: { timestamp?: string }) => (
  <div className="text-xs mt-5 flex flex-col md:flex-row justify-center md:space-x-3 items-center">
    <a
      className="underline text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out"
      href="https://miluma.lumapr.com/outages/outageMap"
      target="_blank"
      rel="noopener noreferrer"
    >
      Original Data Source
    </a>
    {timestamp && (
      <p className="font-light mt-2 md:mt-0">Updated on: {timestamp}</p>
    )}
  </div>
);

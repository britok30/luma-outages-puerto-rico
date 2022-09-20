import React from "react";
import { getCurrentDate } from "../utils";

export const Footer = () => {
  return (
    <footer className="flex text-md mt-20 mb-10 flex-col h-24 w-full items-center justify-center">
      <div className="text-red-400 text-xs">
        <p>Not affiliated with the Puerto Rican Government or LUMA Energy.</p>
        <p>No está afiliado con el Gobierno de Puerto Rico o LUMA Energy.</p>
      </div>
      <div className="text-xs mt-2 flex space-x-3">
        <a
          className="underline"
          href="https://miluma.lumapr.com/outages/outageMap"
          target="_blank"
          rel="no_referrer"
        >
          Original Data Source
        </a>
        <p className="font-light">{getCurrentDate()}</p>
      </div>
      <div className="my-3 text-center text-xs">
        <div className="text-blue-500 mb-2">
          <p>© 2022 | Designed & built by Kelvin Brito</p>
          <p>Made with ❤️ with React, Next.js, TypeScript & Tailwind</p>
        </div>
      </div>
    </footer>
  );
};

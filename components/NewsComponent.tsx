import React from "react";
import { NewsEntries } from "../types";

export const NewsComponent = ({
  newsEntries,
}: {
  newsEntries: NewsEntries[];
}) => {
  return (
    <div className="my-10">
      <h2 className="text-2xl md:text-4xl mb-2 text-red-400">
        Puerto Rico Top News / Las mejores noticias de Puerto Rico
      </h2>
      {newsEntries.slice(0, 10).map((entry) => {
        return (
          <p className="mb-2 text-gray-400 text-md md:text-lg hover:text-white transition duration-200 ease-in-out text-left">
            {`${entry.title}`}:{" "}
            <a
              className="hover:underline text-white text-xs md:text-sm font-bold block"
              target="_blank"
              rel="no_referrer"
              href={entry.link}
            >
              Source
            </a>
          </p>
        );
      })}
    </div>
  );
};

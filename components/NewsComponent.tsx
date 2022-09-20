import React from "react";
import { NewsEntries } from "../types";

export const NewsComponent = ({
  newsEntries,
}: {
  newsEntries: NewsEntries[];
}) => {
  return (
    <div className="my-10">
      <h2 className="text-xl md:text-2xl mb-2 text-red-400">
        Puerto Rico Top News / Las mejores noticias de Puerto Rico
      </h2>
      {newsEntries.slice(0, 10).map((entry) => {
        return (
          <div className="mb-2 text-gray-400 hover:text-white transition duration-200 ease-in-out">
            <a
              className="hover:underline"
              target="_blank"
              rel="no_referrer"
              href={entry.link}
            >
              {`${entry.title}-${entry.published}`}
            </a>
          </div>
        );
      })}
    </div>
  );
};

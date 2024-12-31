import axios from "axios";
import { Outage } from "./types";

export const getOutage = async () => {
  try {
    const response = await fetch(
      "https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService",
      {
        cache: "no-cache",
        next: {
          revalidate: 3600,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const outages = (await response.json()) as Outage;

    return outages;
  } catch (e) {
    console.error("Failed to fetch outages:", e);
  }
};

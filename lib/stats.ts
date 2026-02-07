import { Outage } from "./types";

export const getClientsWithoutService = async (): Promise<Outage | null> => {
  try {
    const response = await fetch(
      "https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService",
      {
        next: {
          revalidate: 300, // Revalidate data every 5 minutes
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }

    const outages: Outage = await response.json();
    return outages;
  } catch (e) {
    console.error("Failed to fetch clients:", e);
    return null; // Return null or a default value in case of error
  }
};

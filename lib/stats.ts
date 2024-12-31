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

export const getPoverty = async () => {
  const { data: poverty } = await axios.get(
    "https://datausa.io/api/data?Geography=04000US72&drilldowns=Age,Gender&measure=Poverty%20Population,Poverty%20Population%20Moe&Poverty%20Status=0&year=latest"
  );

  return poverty;
};

export const getWages = async () => {
  const { data: wages } = await axios.get(
    "https://datausa.io/api/data?Geography=04000US72&measure=Total%20Population,Total%20Population%20MOE%20Appx,Record%20Count&drilldowns=Wage%20Bin&Workforce%20Status=true&Record%20Count>=5&year=latest"
  );

  return wages;
};

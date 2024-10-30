import axios from "axios";
import { Outage } from "./types";

export const getOutage = async (): Promise<Outage> => {
  const { data: outages } = await axios.get(
    "https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService"
  );

  return outages;
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

import { CensusData, Outage } from "./types";

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
    return null;
  }
};

const CENSUS_YEAR = 2024;
const PR_FIPS = "72";

async function fetchCensus(url: string): Promise<string[][]> {
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Census API error: ${res.statusText}`);
  return res.json();
}

export const getCensusData = async (): Promise<CensusData | null> => {
  try {
    const [povertyRaw, incomeRaw, wageRaw, employRaw, eduRaw, healthRaw] =
      await Promise.all([
        // Poverty (S1701)
        fetchCensus(
          `https://api.census.gov/data/${CENSUS_YEAR}/acs/acs1/subject?get=NAME,S1701_C01_001E,S1701_C02_001E,S1701_C03_001E,S1701_C02_002E,S1701_C03_002E,S1701_C02_006E,S1701_C03_006E,S1701_C02_010E,S1701_C03_010E,S1701_C02_011E,S1701_C03_011E,S1701_C02_012E,S1701_C03_012E&for=state:${PR_FIPS}`
        ),
        // Income (S1901)
        fetchCensus(
          `https://api.census.gov/data/${CENSUS_YEAR}/acs/acs1/subject?get=NAME,S1901_C01_001E,S1901_C01_002E,S1901_C01_003E,S1901_C01_004E,S1901_C01_005E,S1901_C01_006E,S1901_C01_007E,S1901_C01_008E,S1901_C01_009E,S1901_C01_010E,S1901_C01_011E,S1901_C01_012E,S1901_C01_013E&for=state:${PR_FIPS}`
        ),
        // Gender Wage (S2001 + B20017)
        fetchCensus(
          `https://api.census.gov/data/${CENSUS_YEAR}/acs/acs1?get=NAME,B20017_001E,B20017_002E,B20017_005E,B20001_001E,B20001_002E&for=state:${PR_FIPS}`
        ),
        // Employment (S2301)
        fetchCensus(
          `https://api.census.gov/data/${CENSUS_YEAR}/acs/acs1/subject?get=NAME,S2301_C01_001E,S2301_C02_001E,S2301_C03_001E,S2301_C04_001E&for=state:${PR_FIPS}`
        ),
        // Education (S1501)
        fetchCensus(
          `https://api.census.gov/data/${CENSUS_YEAR}/acs/acs1/subject?get=NAME,S1501_C01_006E,S1501_C01_007E,S1501_C01_009E,S1501_C01_012E,S1501_C01_013E,S1501_C01_014E,S1501_C01_015E&for=state:${PR_FIPS}`
        ),
        // Health Insurance (S2701)
        fetchCensus(
          `https://api.census.gov/data/${CENSUS_YEAR}/acs/acs1/subject?get=NAME,S2701_C03_001E,S2701_C05_001E&for=state:${PR_FIPS}`
        ),
      ]);

    const p = povertyRaw[1];
    const i = incomeRaw[1];
    const w = wageRaw[1];
    const emp = employRaw[1];
    const edu = eduRaw[1];
    const h = healthRaw[1];

    const totalWorkers = Number(w[4]); // B20001_001E total with earnings
    const maleWorkers = Number(w[5]); // B20001_002E male with earnings
    const femaleWorkers = totalWorkers - maleWorkers;

    const pop25Plus = Number(edu[1]);

    return {
      poverty: {
        year: CENSUS_YEAR,
        totalPopulation: Number(p[1]),
        totalBelowPoverty: Number(p[2]),
        overallRate: Number(p[3]),
        groups: [
          { label: "Under 18", population: Number(p[4]), percentage: Number(p[5]) },
          { label: "18 to 64", population: Number(p[6]), percentage: Number(p[7]) },
          { label: "65 and over", population: Number(p[8]), percentage: Number(p[9]) },
          { label: "Male", population: Number(p[10]), percentage: Number(p[11]) },
          { label: "Female", population: Number(p[12]), percentage: Number(p[13]) },
        ],
      },
      income: {
        year: CENSUS_YEAR,
        totalHouseholds: Number(i[1]),
        medianIncome: Number(i[12]),
        meanIncome: Number(i[13]),
        brackets: [
          { label: "< $10k", percentage: Number(i[2]) },
          { label: "$10k\u2013$15k", percentage: Number(i[3]) },
          { label: "$15k\u2013$25k", percentage: Number(i[4]) },
          { label: "$25k\u2013$35k", percentage: Number(i[5]) },
          { label: "$35k\u2013$50k", percentage: Number(i[6]) },
          { label: "$50k\u2013$75k", percentage: Number(i[7]) },
          { label: "$75k\u2013$100k", percentage: Number(i[8]) },
          { label: "$100k\u2013$150k", percentage: Number(i[9]) },
          { label: "$150k\u2013$200k", percentage: Number(i[10]) },
          { label: "$200k+", percentage: Number(i[11]) },
        ],
      },
      genderWage: {
        year: CENSUS_YEAR,
        overallMedian: Number(w[1]),
        maleMedian: Number(w[2]),
        femaleMedian: Number(w[3]),
        maleWorkers,
        femaleWorkers,
        totalWorkers,
      },
      employment: {
        year: CENSUS_YEAR,
        population16Plus: Number(emp[1]),
        laborForceRate: Number(emp[2]),
        employmentRatio: Number(emp[3]),
        unemploymentRate: Number(emp[4]),
      },
      education: {
        year: CENSUS_YEAR,
        population25Plus: pop25Plus,
        levels: [
          { label: "Less than 9th grade", count: Number(edu[2]), percentage: Math.round((Number(edu[2]) / pop25Plus) * 1000) / 10 },
          { label: "High school graduate", count: Number(edu[3]), percentage: Math.round((Number(edu[3]) / pop25Plus) * 1000) / 10 },
          { label: "Bachelor's degree", count: Number(edu[4]), percentage: Math.round((Number(edu[4]) / pop25Plus) * 1000) / 10 },
          { label: "Graduate / professional", count: Number(edu[5]), percentage: Math.round((Number(edu[5]) / pop25Plus) * 1000) / 10 },
        ],
      },
      healthInsurance: {
        year: CENSUS_YEAR,
        insuredRate: Number(h[1]),
        uninsuredRate: Number(h[2]),
      },
    };
  } catch (e) {
    console.error("Failed to fetch Census data:", e);
    return null;
  }
};

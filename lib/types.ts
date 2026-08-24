export interface Regions {
  name: string;
  totalClients: number;
  totalClientsWithoutService: number;
  totalClientsWithService?: number;
  /** Customers out because of scheduled maintenance / improvements. */
  totalClientsAffectedByPlannedOutage?: number;
  /** Customers out because of load shedding ("relevo de carga"). */
  totalClientsAffectedByLoadShed?: number;
  percentageClientsWithoutService: number;
  percentageClientsWithService?: number;
}

export interface Totals {
  totalClientsWithoutService: number;
  totalClients: number;
  totalClientsWithService: number;
  totalPercentageWithoutService: number;
  totalPercentageWithService: number;
  totalClientsAffectedByPlannedOutage?: number;
  totalClientsAffectedByLoadShed?: number;
}

export interface Plant {
  name: string;
  mw: number;
  maxMw: number | null;
}

/** Scraped from https://lumapr.com/system-overview/ */
export interface SystemOverview {
  demandMw: number;
  nextHourDemandMw: number;
  reserveMw: number;
  peakDemandMw: number | null;
  peakReserveMw: number | null;
  plants: Plant[];
  /** ISO timestamp of when we scraped it (LUMA doesn't publish one). */
  fetchedAt: string;
}

export interface Outage {
  regions: Regions[];
  totals: Totals;
  timestamp: string;
}

export interface PovertyGroup {
  label: string;
  population: number;
  percentage: number;
}

export interface PovertyData {
  year: number;
  totalPopulation: number;
  totalBelowPoverty: number;
  overallRate: number;
  groups: PovertyGroup[];
}

export interface IncomeBracket {
  label: string;
  percentage: number;
}

export interface IncomeData {
  year: number;
  totalHouseholds: number;
  medianIncome: number;
  meanIncome: number;
  brackets: IncomeBracket[];
}

export interface GenderWageData {
  year: number;
  overallMedian: number;
  maleMedian: number;
  femaleMedian: number;
  maleWorkers: number;
  femaleWorkers: number;
  totalWorkers: number;
}

export interface EmploymentData {
  year: number;
  population16Plus: number;
  laborForceRate: number;
  employmentRatio: number;
  unemploymentRate: number;
}

export interface EducationLevel {
  label: string;
  count: number;
  percentage: number;
}

export interface EducationData {
  year: number;
  population25Plus: number;
  levels: EducationLevel[];
}

export interface HealthInsuranceData {
  year: number;
  insuredRate: number;
  uninsuredRate: number;
}

export interface CensusData {
  poverty: PovertyData;
  income: IncomeData;
  genderWage: GenderWageData;
  employment: EmploymentData;
  education: EducationData;
  healthInsurance: HealthInsuranceData;
}

export interface Regions {
  name: string;
  totalClients: number;
  totalClientsWithoutService: number;
  percentageClientsWithoutService: number;
}

export interface Totals {
  totalClientsWithoutService: number;
  totalClients: number;
  totalClientsWithService: number;
  totalPercentageWithoutService: number;
  totalPercentageWithService: number;
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

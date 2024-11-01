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

export interface Towns {
  [key: string]: ZoneArea[];
}

export interface ZoneArea {
  zone: string;
  area: string;
  size?: number;
}

export interface Wages {
  data: WageData[];
  source: Source[];
}

export interface Poverty {
  data: PovertyData[];
  source: Source[];
}

export type WebStateRecord = {
  StateName: string;
  StateStatus: string;
  OutageCount: number;
  CustomerCount: number;
};

export interface PovertyData {
  "ID Age": number;
  Age: string;
  "ID Gender": number;
  Gender: string;
  "ID Year": number;
  Year: string;
  "ID Poverty Status": number;
  "Poverty Status": string;
  "Poverty Population": number;
  "Poverty Population Moe": number;
  Geography: string;
  "ID Geography": string;
  "Slug Geography": string;
}

export interface WageData {
  "ID Wage Bin": number;
  "Wage Bin": string;
  "ID Year": number;
  Year: string;
  "ID Workforce Status": boolean;
  "Workforce Status": string | boolean;
  "Total Population": number;
  "Total Population MOE Appx": number;
  "Record Count": number;
  Geography: string;
  "ID Geography": string;
  "Slug Geography": string;
}

export interface Source {
  measures: string[];
  annotations: {
    source_name: string;
    source_description: string;
    dataset_name: string;
    dataset_link: string;
    subtopic: string;
    table_id: string;
    topic: string;
    hidden_measures: string;
  };
  name: string;
  substitutions: any[];
}

export interface Outage {
  regions: Regions[];
  totals: Totals;
  timestamp: string;
}

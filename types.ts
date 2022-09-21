export interface Regions {
  name: string;
  totalClients: number;
  totalClientsWithoutService: number;
  percentageClientsWithoutService: number;
}

export interface Totals {
  totalClientsWithoutService: number;
  totalClients: number;
  totalPercentage: number;
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

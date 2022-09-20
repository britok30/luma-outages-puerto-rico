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

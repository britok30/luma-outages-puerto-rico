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

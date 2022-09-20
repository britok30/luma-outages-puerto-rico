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

export interface News {
  entries: NewsEntries[];
  device_region: string;
  device_type: string;
}

export interface NewsEntries {
  title: string;
  title_detail: {
    type: string;
    language: string | null;
    base: string;
    value: string;
  };
  links: [
    {
      rel: string;
      type: string;
      href: string;
    }
  ];
  link: string;
  id: string;
  guidislink: boolean;
  published: string;
  published_parsed: number[];
  summary: string;
  summary_detail: {
    type: string;
    language: string | null;
    base: string;
    value: string;
  };
  source: {
    href: string;
    title: string;
  };
  sub_articles: {
    url: string;
    title: string;
    publisher: string;
  }[];
}

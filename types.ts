
export interface MetricData {
  timestamp: string;
  visitors: number;
  pageViews: number;
  errors: number;
  latency: number;
}

export interface EndpointStat {
  path: string;
  calls: number;
  avgLatency: number;
  status: number;
}

export interface GeoLocation {
  city: string;
  country: string;
  lat: number;
  lng: number;
  users: number;
}

export interface AIInsight {
  summary: string;
  anomalies: string[];
  recommendations: string[];
}

export interface DashboardData {
  metrics: MetricData[];
  endpoints: EndpointStat[];
  geoData: GeoLocation[];
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  MAPS = 'MAPS',
  SETTINGS = 'SETTINGS',
  INTEGRATION = 'INTEGRATION'
}

export enum MapRegion {
  WORLD = 'WORLD',
  TURKEY = 'TURKEY'
}

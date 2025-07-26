export interface CitySummary {
  city: string;
  o2har: number;
  unserviceability: number;
  totalPods: number;
  breachedPods: number;
  lastUpdated: string;
  owner?: {
    name: string;
    email: string;
  };
} 
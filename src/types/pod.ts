export interface PodData {
  pod_id: string;
  pod_name: string;
  zone: string;
  city: string;
  city_owner_name: string;
  city_owner_email: string;
  pod_owner_name: string;
  pod_owner_email: string;
  date: string;
  o2har: number;
  unserviceability: number;
  root_causes: string[];
  recommend_surge: string;
  recommend_cohort_call: string;
  hourly_metrics?: HourlyMetric[];
}

export interface HourlyMetric {
  hour: string;
  o2har: number;
  unserviceability: number;
  date: string;
} 
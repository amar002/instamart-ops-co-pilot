export interface PodData {
  pod_id: string;
  pod_name: string;
  zone: string;
  city: string;
  city_owner_name: string;
  city_owner_email: string;
  pod_owner_name: string;
  pod_owner_email: string;
  date: string; // ISO string
  o2har: number;
  unserviceability: number;
  root_causes: string[];
  recommend_surge: string;
  recommend_cohort_call: string;
  hourly_metrics?: Array<{
    hour: string; // e.g. '09:00'
    o2har: number;
    unserviceability: number;
    date: string; // ISO
  }>;
  hourly_metrics_yesterday?: Array<{
    hour: string; // e.g. '09:00'
    o2har: number;
    unserviceability: number;
    date: string; // ISO
  }>;
  hourly_metrics_sdlw?: Array<{
    hour: string; // e.g. '09:00'
    o2har: number;
    unserviceability: number;
    date: string; // ISO
  }>;
  root_causes_details?: Array<{
    description: string;
    actual: number;
    expected: number;
    unit: string;
    percent_diff: number;
  }>;
  surge_table?: Array<{
    cohort: string;
    existing_surge: number;
    recommended_surge: number;
    current_surge_rupees?: number;
    recommended_surge_rupees?: number;
  }>;
  workforce_table?: Array<{
    cohort: string;
    needed: number;
    current: number;
    gap: number;
  }>;
}

export interface PodCardProps {
  pod: PodData;
  onClick: (podId: string) => void;
}

export interface CityCardProps {
  city: string;
  cityOwnerName: string;
  cityOwnerEmail: string;
  o2har: number;
  unserviceability: number;
  breachedPods: number;
  totalPods: number;
  lastUpdated: string;
  onClick: () => void;
}

export interface Alert {
  id: string;
  podId: string;
  metric: 'o2har' | 'unserviceability';
  condition: '>' | '<';
  threshold: number;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  message: string;
  timestamp: Date;
} 
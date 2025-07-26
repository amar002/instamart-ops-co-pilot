import { PodData, CitySummary } from '../types';
import { THRESHOLDS } from './constants';

export const getLatestPodData = (pods: PodData[]): PodData[] => {
  // Get latest data per pod (similar to getCitySummaries logic)
  const latestPods: PodData[] = [];
  const podMap = new Map<string, PodData>();
  
  pods.forEach(pod => {
    const key = pod.pod_id;
    if (!podMap.has(key) || new Date(pod.date) > new Date(podMap.get(key)!.date)) {
      podMap.set(key, pod);
    }
  });
  
  podMap.forEach(pod => latestPods.push(pod));
  
  return latestPods;
};

export const getPodTrend = (pods: PodData[], podId: string): PodData[] => {
  return pods
    .filter(pod => pod.pod_id === podId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);
};

export const isMetricBreached = (metric: 'o2har' | 'unserviceability', value: number): boolean => {
  return metric === 'o2har' ? value > THRESHOLDS.O2HAR : value > THRESHOLDS.UNSERVICEABILITY;
};

export const getStatusColor = (pod: PodData): string => {
  const o2harBreached = isMetricBreached('o2har', pod.o2har);
  const unserviceabilityBreached = isMetricBreached('unserviceability', pod.unserviceability);
  
  return (o2harBreached || unserviceabilityBreached) ? 'bg-error-500' : 'bg-success-500';
};

export const getCitySummaries = (podsData: PodData[]): CitySummary[] => {
  // Get latest data per pod
  const latestPods: PodData[] = [];
  const podMap = new Map<string, PodData>();
  
  podsData.forEach(pod => {
    const key = pod.pod_id;
    if (!podMap.has(key) || new Date(pod.date) > new Date(podMap.get(key)!.date)) {
      podMap.set(key, pod);
    }
  });
  
  podMap.forEach(pod => latestPods.push(pod));
  
  // Group by city
  const cityMap = new Map<string, CitySummary>();
  
  latestPods.forEach(pod => {
    if (!cityMap.has(pod.city)) {
      cityMap.set(pod.city, {
        city: pod.city,
        o2har: 0,
        unserviceability: 0,
        totalPods: 0,
        breachedPods: 0,
        lastUpdated: pod.date,
        owner: {
          name: pod.city_owner_name,
          email: pod.city_owner_email,
        },
      });
    }
    
    const city = cityMap.get(pod.city)!;
    city.o2har += pod.o2har;
    city.unserviceability += pod.unserviceability;
    city.totalPods += 1;
    
    if (pod.o2har > THRESHOLDS.O2HAR || pod.unserviceability > THRESHOLDS.UNSERVICEABILITY) {
      city.breachedPods += 1;
    }
    
    if (new Date(pod.date) > new Date(city.lastUpdated)) {
      city.lastUpdated = pod.date;
    }
  });
  
  // Average metrics
  cityMap.forEach(city => {
    city.o2har = city.o2har / city.totalPods;
    city.unserviceability = city.unserviceability / city.totalPods;
  });
  
  return Array.from(cityMap.values());
};

export const mockPromptQLResponse = (question: string): string => {
  const responses = [
    "Based on the current metrics, I recommend increasing DE allocation by 20% for this pod.",
    "The O2HAR threshold breach suggests we need to implement surge pricing immediately.",
    "Consider calling additional part-time DEs to address the current shortage.",
    "Traffic conditions are affecting delivery times. Suggest alternative routes to DEs.",
    "The unserviceability rate indicates we need to optimize the delivery radius.",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}; 
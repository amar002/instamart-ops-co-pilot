import { PodData } from '../types';
import { THRESHOLDS } from './constants';

export const getLatestPodData = (pods: PodData[]): PodData[] => {
  const latestDate = new Date(Math.max(...pods.map(pod => new Date(pod.date).getTime())));
  const latestDateStr = latestDate.toISOString().split('T')[0];
  
  return pods.filter(pod => pod.date === latestDateStr);
};

export const getPodTrend = (pods: PodData[], podId: string): PodData[] => {
  return pods
    .filter(pod => pod.pod_id === podId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);
};

export const isMetricBreached = (metric: 'o2har' | 'unserviceability', value: number): boolean => {
  const threshold = metric === 'o2har' ? THRESHOLDS.O2HAR : THRESHOLDS.UNSERVICEABILITY;
  return value > threshold;
};

export const getStatusColor = (pod: PodData): string => {
  const o2harBreached = isMetricBreached('o2har', pod.o2har);
  const unserviceabilityBreached = isMetricBreached('unserviceability', pod.unserviceability);
  
  return (o2harBreached || unserviceabilityBreached) ? 'bg-swiggy-error' : 'bg-swiggy-success';
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PodData } from '../types';
import CityCard from '../components/CityCard';
import ChatBot from '../components/ChatBot';
import DarkModeToggle from '../components/DarkModeToggle';

interface CitySummary {
  city: string;
  cityOwnerName: string;
  cityOwnerEmail: string;
  o2har: number;
  unserviceability: number;
  breachedPods: number;
  totalPods: number;
  lastUpdated: string;
}

const Dashboard: React.FC = () => {
  const [pods, setPods] = useState<PodData[]>([]);
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await fetch('/data/pods.json');
        const data: PodData[] = await response.json();
        setPods(data);
        // Aggregate by city (latest date per pod)
        const latestPods: PodData[] = [];
        const podMap = new Map<string, PodData>();
        data.forEach(pod => {
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
              cityOwnerName: pod.city_owner_name,
              cityOwnerEmail: pod.city_owner_email,
              o2har: 0,
              unserviceability: 0,
              breachedPods: 0,
              totalPods: 0,
              lastUpdated: pod.date,
            });
          }
          const city = cityMap.get(pod.city)!;
          city.o2har += pod.o2har;
          city.unserviceability += pod.unserviceability;
          city.totalPods += 1;
          if (pod.o2har > 9.0 || pod.unserviceability > 5.0) city.breachedPods += 1;
          if (new Date(pod.date) > new Date(city.lastUpdated)) city.lastUpdated = pod.date;
        });
        // Average metrics
        cityMap.forEach(city => {
          city.o2har = city.o2har / city.totalPods;
          city.unserviceability = city.unserviceability / city.totalPods;
        });
        setCities(Array.from(cityMap.values()));
      } catch (error) {
        console.error('Error fetching pods:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPods();
  }, []);

  const handleCityClick = (city: string) => {
    navigate(`/city/${encodeURIComponent(city)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instamart-blue mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading cities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Instamart Ops Co-Pilot</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">City Operations Overview</p>
          </div>
          <DarkModeToggle />
        </div>
      </div>

      {/* City Cards */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cities.map(city => (
            <CityCard
              key={city.city}
              {...city}
              onClick={() => handleCityClick(city.city)}
            />
          ))}
        </div>
      </div>

      {/* ChatBot */}
      <ChatBot isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  );
};

export default Dashboard; 
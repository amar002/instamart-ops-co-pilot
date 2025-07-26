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
  const [filteredCities, setFilteredCities] = useState<CitySummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
        const citiesArray = Array.from(cityMap.values());
        setCities(citiesArray);
        setFilteredCities(citiesArray);
      } catch (error) {
        console.error('Error fetching pods:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPods();
  }, []);

  // Filter cities based on search term
  useEffect(() => {
    const filtered = cities.filter(city =>
      city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.cityOwnerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  const handleCityClick = (city: string) => {
    navigate(`/city/${encodeURIComponent(city)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-swiggy-orange/20 border-t-swiggy-orange mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading cities...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Please wait while we fetch the latest data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-swiggy-orange to-swiggy-red shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl">🛒</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Instamart Ops Co-Pilot</h1>
              <p className="text-sm text-white/90">Real-time City Operations Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right text-white">
              <div className="text-sm opacity-90">Last Updated</div>
              <div className="text-xs opacity-75">{new Date().toLocaleTimeString()}</div>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </div>

      {/* Search and Quick Actions */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search cities or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-swiggy-orange focus:border-transparent dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/alerts')}
              className="px-4 py-2 bg-swiggy-orange text-white rounded-lg hover:bg-swiggy-red transition-colors font-medium flex items-center space-x-2"
            >
              <span>🔔</span>
              <span>Set Alerts</span>
            </button>
            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-2 bg-swiggy-secondary text-white rounded-lg hover:bg-swiggy-dark transition-colors font-medium flex items-center space-x-2"
            >
              <span>💬</span>
              <span>Ask AI</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh Data</span>
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Cities</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{cities.length}</p>
                </div>
                <div className="w-12 h-12 bg-swiggy-orange/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏙️</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Pods</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{cities.reduce((sum, city) => sum + city.totalPods, 0)}</p>
                </div>
                <div className="w-12 h-12 bg-swiggy-success/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Breaching Pods</p>
                  <p className="text-2xl font-bold text-swiggy-error">{cities.reduce((sum, city) => sum + city.breachedPods, 0)}</p>
                </div>
                <div className="w-12 h-12 bg-swiggy-error/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* City Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCities.map(city => (
            <CityCard
              key={city.city}
              {...city}
              onClick={() => handleCityClick(city.city)}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredCities.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400">No cities found matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-swiggy-orange hover:text-swiggy-red underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* ChatBot */}
      <ChatBot isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  );
};

export default Dashboard; 
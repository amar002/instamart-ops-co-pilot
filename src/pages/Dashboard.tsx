import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CityCard from '../components/CityCard';
import ChatBot from '../components/ChatBot';
import { PodData, CitySummary } from '../types';
import { getCitySummaries } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'name' | 'breachedPods'>('priority');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/pods.json');
        const data: PodData[] = await response.json();
        const citySummaries = getCitySummaries(data);
        setCities(citySummaries);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Priority calculation function
  const getPriorityLevel = (city: CitySummary) => {
    const breachRate = city.totalPods > 0 ? (city.breachedPods / city.totalPods) * 100 : 0;
    if (breachRate > 50) return 4; // Critical
    if (breachRate > 25) return 3; // High
    if (breachRate > 10) return 2; // Medium
    return 1; // Low
  };

  // Sort cities based on selected criteria
  const getSortedCities = (cities: CitySummary[]) => {
    switch (sortBy) {
      case 'priority':
        return [...cities].sort((a, b) => getPriorityLevel(b) - getPriorityLevel(a));
      case 'name':
        return [...cities].sort((a, b) => a.city.localeCompare(b.city));
      case 'breachedPods':
        return [...cities].sort((a, b) => b.breachedPods - a.breachedPods);
      default:
        return cities;
    }
  };

  const filteredCities = getSortedCities(cities.filter(city =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Get priority-based stats
  const criticalCities = cities.filter(city => getPriorityLevel(city) === 4);
  const highPriorityCities = cities.filter(city => getPriorityLevel(city) === 3);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Instamart Ops Co-Pilot
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Real-time City Operations Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Actions */}
        <div className="mb-8 space-y-6">
          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-dark-card border border-dark-border rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent placeholder-gray-400 text-white"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'priority' | 'name' | 'breachedPods')}
                className="w-full px-4 py-4 bg-dark-card border border-dark-border rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-white"
              >
                <option value="priority">Sort by Priority</option>
                <option value="name">Sort by Name</option>
                <option value="breachedPods">Sort by Breached Pods</option>
              </select>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/alerts')}
              className="px-6 py-3 bg-accent-500 text-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 font-medium flex items-center space-x-3 hover:scale-105"
            >
              <span className="text-lg">🔔</span>
              <span>Set Alerts</span>
            </button>
            <button
              onClick={() => setChatOpen(true)}
              className="px-6 py-3 bg-dark-card border border-dark-border text-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 font-medium flex items-center space-x-3 hover:scale-105 hover:bg-dark-hover"
            >
              <span className="text-lg">💬</span>
              <span>Ask AI</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-dark-card border border-dark-border text-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 font-medium flex items-center space-x-3 hover:scale-105 hover:bg-dark-hover"
            >
              <span className="text-lg">🔄</span>
              <span>Refresh Data</span>
            </button>
          </div>

          {/* Priority Alerts Section */}
          {(criticalCities.length > 0 || highPriorityCities.length > 0) && (
            <div className="space-y-4">
              {criticalCities.length > 0 && (
                <div className="bg-error-500/10 border border-error-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">🚨</span>
                    <h3 className="text-lg font-bold text-error-500">Critical Priority Cities</h3>
                    <span className="bg-error-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {criticalCities.length}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {criticalCities.map(city => city.city).join(', ')} - More than 50% of pods are breaching thresholds
                  </p>
                </div>
              )}
              
              {highPriorityCities.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="text-lg font-bold text-orange-500">High Priority Cities</h3>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {highPriorityCities.length}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {highPriorityCities.map(city => city.city).join(', ')} - 25-50% of pods are breaching thresholds
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Total Cities</p>
                  <p className="text-3xl font-bold text-white">{cities.length}</p>
                </div>
                <div className="w-14 h-14 bg-accent-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏙️</span>
                </div>
              </div>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Total Pods</p>
                  <p className="text-3xl font-bold text-success-500">{cities.reduce((sum, city) => sum + city.totalPods, 0)}</p>
                </div>
                <div className="w-14 h-14 bg-success-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Breaching Pods</p>
                  <p className="text-3xl font-bold text-error-500">{cities.reduce((sum, city) => sum + city.breachedPods, 0)}</p>
                </div>
                <div className="w-14 h-14 bg-error-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Critical Cities</p>
                  <p className="text-3xl font-bold text-error-500">{criticalCities.length}</p>
                </div>
                <div className="w-14 h-14 bg-error-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚨</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* City Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCities.map(city => (
            <CityCard
              key={city.city}
              city={city.city}
              o2har={city.o2har}
              unserviceability={city.unserviceability}
              totalPods={city.totalPods}
              breachedPods={city.breachedPods}
              lastUpdated={city.lastUpdated}
              owner={city.owner}
              priorityLevel={getPriorityLevel(city)}
              onClick={() => navigate(`/city/${city.city}`)}
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredCities.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🔍</div>
            <p className="text-gray-400 text-lg mb-4">No cities found matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-accent-500 hover:text-accent-400 underline font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <ChatBot isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  );
};

export default Dashboard; 
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

  const filteredCities = cities.filter(city =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.owner?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {/* Search Bar */}
          <div className="relative">
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

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
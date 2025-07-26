import React from 'react';
import { THRESHOLDS } from '../utils/constants';

interface CityCardProps {
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
  onClick: () => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, o2har, unserviceability, breachedPods, totalPods, lastUpdated, owner, onClick }) => {
  const o2harBreached = o2har > THRESHOLDS.O2HAR;
  const unserviceabilityBreached = unserviceability > THRESHOLDS.UNSERVICEABILITY;
  const statusColor = (o2harBreached || unserviceabilityBreached) ? 'bg-error-500' : 'bg-success-500';

  return (
    <div 
      className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-6 cursor-pointer hover:shadow-medium hover:scale-105 transition-all duration-300 group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
            <span className="text-white font-bold text-lg">{city.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-accent-400 transition-colors">
              {city}
            </h3>
            {owner && (
              <p className="text-sm text-gray-400 mt-1">
                Owner: {owner.name} (
                <a 
                  href={`mailto:${owner.email}`} 
                  className="text-accent-500 hover:text-accent-400 underline transition-colors"
                >
                  {owner.email}
                </a>
                )
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${statusColor} shadow-sm`}></div>
          <div className="text-xs text-gray-500">●</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-dark-hover rounded-xl hover:bg-dark-border transition-all duration-200">
          <p className="text-xs text-gray-400 mb-2 font-medium">O2HAR</p>
          <p className={`text-2xl font-bold ${o2harBreached ? 'text-error-500' : 'text-success-500'}`}>
            {o2har.toFixed(1)} Mins
          </p>
          <p className="text-xs text-gray-500">Threshold: {THRESHOLDS.O2HAR} Mins</p>
        </div>
        <div className="text-center p-4 bg-dark-hover rounded-xl hover:bg-dark-border transition-all duration-200">
          <p className="text-xs text-gray-400 mb-2 font-medium">Unserviceability</p>
          <p className={`text-2xl font-bold ${unserviceabilityBreached ? 'text-error-500' : 'text-success-500'}`}>
            {unserviceability.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">Threshold: {THRESHOLDS.UNSERVICEABILITY}%</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-3">
          <span className="bg-error-500/10 text-error-500 px-3 py-1 rounded-full font-medium text-xs">
            ⚠️ {breachedPods} Breaching
          </span>
          <span className="text-gray-400">/ {totalPods} Total</span>
        </div>
        <div className="text-right">
          <div className="text-gray-400 text-xs">Last updated</div>
          <div className="font-semibold text-white text-xs">
            {new Date(lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityCard; 
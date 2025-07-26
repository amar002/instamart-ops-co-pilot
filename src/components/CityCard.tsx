import React from 'react';
import { CityCardProps } from '../types';

const CityCard: React.FC<CityCardProps> = ({ city, cityOwnerName, cityOwnerEmail, o2har, unserviceability, breachedPods, totalPods, lastUpdated, onClick }) => {
  const o2harBreached = o2har > 9.0;
  const unserviceabilityBreached = unserviceability > 5.0;
  const statusColor = (o2harBreached || unserviceabilityBreached) ? 'bg-instamart-red' : 'bg-instamart-green';

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white underline">{city}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Owner: {cityOwnerName} (<a href={`mailto:${cityOwnerEmail}`} className="text-instamart-blue underline">{cityOwnerEmail}</a>)</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">O2HAR</p>
          <p className={`text-lg font-bold ${o2harBreached ? 'text-instamart-red' : 'text-instamart-green'}`}>
            {o2har.toFixed(1)} Mins
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Threshold: 9.0 Mins</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Unserviceability</p>
          <p className={`text-lg font-bold ${unserviceabilityBreached ? 'text-instamart-red' : 'text-instamart-green'}`}>
            {unserviceability.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Threshold: 5.0%</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>Pods Breaching: <span className="font-bold text-instamart-red">{breachedPods}</span> / {totalPods}</span>
        <span>Last updated: <span className="font-semibold text-gray-800 dark:text-gray-200">{new Date(lastUpdated).toLocaleString()}</span></span>
      </div>
    </div>
  );
};

export default CityCard; 
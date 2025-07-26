import React from 'react';
import { CityCardProps } from '../types';

const CityCard: React.FC<CityCardProps> = ({ city, cityOwnerName, cityOwnerEmail, o2har, unserviceability, breachedPods, totalPods, lastUpdated, onClick }) => {
  const o2harBreached = o2har > 9.0;
  const unserviceabilityBreached = unserviceability > 5.0;
  const statusColor = (o2harBreached || unserviceabilityBreached) ? 'bg-swiggy-error' : 'bg-swiggy-success';

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-4 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-swiggy-orange to-swiggy-red rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-lg">{city.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-swiggy-orange transition-colors">{city}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Owner: {cityOwnerName} (<a href={`mailto:${cityOwnerEmail}`} className="text-swiggy-orange hover:text-swiggy-red underline transition-colors">{cityOwnerEmail}</a>)</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-full ${statusColor} shadow-md`}></div>
          <div className="text-xs text-gray-500 dark:text-gray-400">●</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">O2HAR</p>
          <p className={`text-xl font-bold ${o2harBreached ? 'text-swiggy-error' : 'text-swiggy-success'}`}>
            {o2har.toFixed(1)} Mins
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Threshold: 9.0 Mins</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Unserviceability</p>
          <p className={`text-xl font-bold ${unserviceabilityBreached ? 'text-swiggy-error' : 'text-swiggy-success'}`}>
            {unserviceability.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Threshold: 5.0%</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <span className="bg-swiggy-error/10 text-swiggy-error px-2 py-1 rounded-full font-medium">
            ⚠️ {breachedPods} Breaching
          </span>
          <span className="text-gray-500">/ {totalPods} Total</span>
        </div>
        <div className="text-right">
          <div className="text-gray-500">Last updated</div>
          <div className="font-semibold text-gray-800 dark:text-gray-200">{new Date(lastUpdated).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default CityCard; 
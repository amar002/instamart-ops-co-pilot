import React from 'react';
import { PodCardProps } from '../types';
import { getStatusColor, isMetricBreached } from '../utils/helpers';
import { THRESHOLDS } from '../utils/constants';

const PodCard: React.FC<PodCardProps> = ({ pod, onClick }) => {
  const statusColor = getStatusColor(pod);
  const o2harBreached = isMetricBreached('o2har', pod.o2har);
  const unserviceabilityBreached = isMetricBreached('unserviceability', pod.unserviceability);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-4 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700 group"
      onClick={() => onClick(pod.pod_id)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-swiggy-orange to-swiggy-red rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-sm">{pod.pod_name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-swiggy-orange transition-colors">{pod.pod_name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{pod.zone}</p>
          </div>
        </div>
        <div className={`w-4 h-4 rounded-full ${statusColor} shadow-md`}></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">O2HAR</p>
          <p className={`text-xl font-bold ${o2harBreached ? 'text-swiggy-error' : 'text-swiggy-success'}`}>
            {pod.o2har} Mins
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Threshold: {THRESHOLDS.O2HAR} Mins</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Unserviceability</p>
          <p className={`text-xl font-bold ${unserviceabilityBreached ? 'text-swiggy-error' : 'text-swiggy-success'}`}>
            {pod.unserviceability}%
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Threshold: {THRESHOLDS.UNSERVICEABILITY}%</p>
        </div>
      </div>
      
      {(o2harBreached || unserviceabilityBreached) && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-3">
          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Issues Detected:</p>
          <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
            {pod.root_causes.map((cause, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {cause}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PodCard; 
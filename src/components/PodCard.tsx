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
      className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-6 mb-4 cursor-pointer hover:shadow-medium hover:scale-105 transition-all duration-300 group"
      onClick={() => onClick(pod.pod_id)}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300">
            <span className="text-white font-bold text-sm">{pod.pod_name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-accent-400 transition-colors">{pod.pod_name}</h3>
            <p className="text-sm text-gray-400">{pod.zone}</p>
          </div>
        </div>
        <div className={`w-4 h-4 rounded-full ${statusColor} shadow-md`}></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-dark-hover rounded-xl hover:bg-dark-border transition-all duration-200">
          <p className="text-xs text-gray-400 mb-2 font-medium">O2HAR</p>
          <p className={`text-2xl font-bold ${o2harBreached ? 'text-error-500' : 'text-success-500'}`}>
            {pod.o2har} Mins
          </p>
          <p className="text-xs text-gray-500">Threshold: {THRESHOLDS.O2HAR} Mins</p>
        </div>
        <div className="text-center p-4 bg-dark-hover rounded-xl hover:bg-dark-border transition-all duration-200">
          <p className="text-xs text-gray-400 mb-2 font-medium">Unserviceability</p>
          <p className={`text-2xl font-bold ${unserviceabilityBreached ? 'text-error-500' : 'text-success-500'}`}>
            {pod.unserviceability}%
          </p>
          <p className="text-xs text-gray-500">Threshold: {THRESHOLDS.UNSERVICEABILITY}%</p>
        </div>
      </div>
      
      {(o2harBreached || unserviceabilityBreached) && (
        <div className="bg-error-500/10 border border-error-500/20 rounded-xl p-4">
          <p className="text-sm font-medium text-error-500 mb-3">Issues Detected:</p>
          <ul className="text-xs text-error-400 space-y-2">
            {pod.root_causes.map((cause, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-error-500 rounded-full mr-3"></span>
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
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
  priorityLevel: number;
  onClick: () => void;
}

const CityCard: React.FC<CityCardProps> = ({ city, o2har, unserviceability, breachedPods, totalPods, lastUpdated, owner, priorityLevel, onClick }) => {
  const o2harBreached = o2har > THRESHOLDS.O2HAR;
  const unserviceabilityBreached = unserviceability > THRESHOLDS.UNSERVICEABILITY;

  // Priority styling
  const getPriorityStyles = () => {
    switch (priorityLevel) {
      case 4: // Critical
        return {
          border: 'border-error-500/30',
          bg: 'bg-error-500/5',
          icon: '🚨',
          label: 'Critical',
          labelColor: 'text-error-500',
          labelBg: 'bg-error-500/20'
        };
      case 3: // High
        return {
          border: 'border-orange-500/30',
          bg: 'bg-orange-500/5',
          icon: '⚠️',
          label: 'High',
          labelColor: 'text-orange-500',
          labelBg: 'bg-orange-500/20'
        };
      case 2: // Medium
        return {
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-500/5',
          icon: '⚡',
          label: 'Medium',
          labelColor: 'text-yellow-500',
          labelBg: 'bg-yellow-500/20'
        };
      default: // Low
        return {
          border: 'border-dark-border',
          bg: 'bg-dark-card',
          icon: '✅',
          label: 'Low',
          labelColor: 'text-success-500',
          labelBg: 'bg-success-500/20'
        };
    }
  };

  const priorityStyles = getPriorityStyles();

  return (
    <div 
      className={`${priorityStyles.bg} border ${priorityStyles.border} rounded-xl shadow-soft p-6 cursor-pointer hover:shadow-medium transition-all duration-200 group`}
      onClick={onClick}
    >
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{priorityStyles.icon}</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${priorityStyles.labelColor} ${priorityStyles.labelBg}`}>
            {priorityStyles.label} Priority
          </span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Last Updated</div>
          <div className="text-xs text-gray-500">{lastUpdated}</div>
        </div>
      </div>

      {/* City Name and Owner */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-accent-400 transition-colors">
          {city}
        </h2>
        {owner && (
          <p className="text-sm text-gray-400">
            Owner: {owner.name} (
            <a 
              href={`mailto:${owner.email}`} 
              className="text-accent-500 hover:text-accent-400 underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {owner.email}
            </a>
            )
          </p>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className={`w-3 h-3 rounded-full ${o2harBreached ? 'bg-error-500' : 'bg-success-500'}`}></div>
            <span className="text-sm text-gray-400 font-medium">O2HAR</span>
          </div>
          <div className={`text-2xl font-bold ${o2harBreached ? 'text-error-500' : 'text-success-500'}`}>
            {o2har.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">Mins</div>
          <p className="text-xs text-gray-500">Threshold: {THRESHOLDS.O2HAR} Mins</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className={`w-3 h-3 rounded-full ${unserviceabilityBreached ? 'bg-error-500' : 'bg-success-500'}`}></div>
            <span className="text-sm text-gray-400 font-medium">Unserviceability</span>
          </div>
          <div className={`text-2xl font-bold ${unserviceabilityBreached ? 'text-error-500' : 'text-success-500'}`}>
            {unserviceability.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Percentage</div>
          <p className="text-xs text-gray-500">Threshold: {THRESHOLDS.UNSERVICEABILITY}%</p>
        </div>
      </div>

      {/* Pods Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-500/10 rounded-xl flex items-center justify-center">
            <span className="text-accent-500 text-lg">📦</span>
          </div>
          <div>
            <div className="text-sm text-gray-400">Total Pods</div>
            <div className="text-lg font-bold text-white">{totalPods}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400">Breaching</div>
          <div className={`text-lg font-bold ${breachedPods > 0 ? 'text-error-500' : 'text-success-500'}`}>
            {breachedPods}
          </div>
          {breachedPods > 0 && (
            <div className="text-xs text-gray-500">
              {((breachedPods / totalPods) * 100).toFixed(0)}% of pods
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Indicators */}
      {(o2harBreached || unserviceabilityBreached) && (
        <div className="mt-4 pt-4 border-t border-dark-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Actions Needed:</span>
            <div className="flex space-x-2">
              {o2harBreached && (
                <span className="text-xs bg-error-500/20 text-error-400 px-2 py-1 rounded-full">
                  Surge Pricing
                </span>
              )}
              {unserviceabilityBreached && (
                <span className="text-xs bg-error-500/20 text-error-400 px-2 py-1 rounded-full">
                  DE Callout
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityCard; 
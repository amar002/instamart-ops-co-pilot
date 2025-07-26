import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PodData } from '../types';
import { getPodTrend, isMetricBreached } from '../utils/helpers';
import { THRESHOLDS } from '../utils/constants';
import ChatBot from '../components/ChatBot';
import MetricsChart from '../components/MetricsChart';
import CollapsibleSection from '../components/CollapsibleSection';

const PodDetail: React.FC = () => {
  const { podId } = useParams<{ podId: string }>();
  const navigate = useNavigate();
  const [, setPodTrend] = useState<PodData[]>([]);
  const [currentPod, setCurrentPod] = useState<PodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [surgeActions, setSurgeActions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPodData = async () => {
      try {
        const response = await fetch('/data/pods.json');
        const data = await response.json();
        const trend = getPodTrend(data, podId!);
        setPodTrend(trend);
        setCurrentPod(trend[0] || null);
        
        // Load existing surge actions from localStorage
        const savedActions = localStorage.getItem(`surge-actions-${podId}`);
        if (savedActions) {
          setSurgeActions(JSON.parse(savedActions));
        }
      } catch (error) {
        console.error('Error fetching pod data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (podId) {
      fetchPodData();
    }
  }, [podId]);

  const handleSurgeActionToggle = (cohort: string) => {
    const newActions = { ...surgeActions, [cohort]: !surgeActions[cohort] };
    setSurgeActions(newActions);
    localStorage.setItem(`surge-actions-${podId}`, JSON.stringify(newActions));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-instamart-blue mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading pod details...</p>
        </div>
      </div>
    );
  }

  if (!currentPod) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Pod not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-instamart-blue text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const o2harBreached = isMetricBreached('o2har', currentPod.o2har);
  const unserviceabilityBreached = isMetricBreached('unserviceability', currentPod.unserviceability);

  // Quick action handlers
  const handleCallDEs = () => {
    const message = `Calling DEs for ${currentPod.pod_name} pod. Current status:\n• O2HAR: ${currentPod.o2har} mins (${o2harBreached ? 'BREACHING' : 'OK'})\n• Unserviceability: ${currentPod.unserviceability}% (${unserviceabilityBreached ? 'BREACHING' : 'OK'})`;
    alert(message);
  };

  const handleIncreaseSurge = () => {
    const message = `Increasing surge pricing for ${currentPod.pod_name} pod.\n\nCurrent O2HAR: ${currentPod.o2har} mins\nRecommended action: Increase surge by 15-20%`;
    alert(message);
  };

  const handleEmailPodOwner = () => {
    const subject = `Urgent - ${currentPod.pod_name} Pod Issues`;
    const body = `Hi ${currentPod.pod_owner_name},\n\n${currentPod.pod_name} pod is currently experiencing issues:\n\n• O2HAR: ${currentPod.o2har} mins (${o2harBreached ? 'BREACHING threshold of 9.0 mins' : 'Within limits'})\n• Unserviceability: ${currentPod.unserviceability}% (${unserviceabilityBreached ? 'BREACHING threshold of 5.0%' : 'Within limits'})\n\nPlease review and take immediate action.\n\nBest regards,\nOps Team`;
    window.open(`mailto:${currentPod.pod_owner_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2 self-start"
              >
                <span>←</span>
                <span className="text-sm md:text-base">Back to Dashboard</span>
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {currentPod.pod_name}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {currentPod.zone}, {currentPod.city}
                </p>
                <p className="text-gray-400 text-sm">
                  Owner: {currentPod.pod_owner_name} (
                  <a 
                    href={`mailto:${currentPod.pod_owner_email}`} 
                    className="text-accent-500 hover:text-accent-400 underline transition-colors"
                  >
                    {currentPod.pod_owner_email}
                  </a>
                  )
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setChatOpen(true)}
                className="px-4 py-2 bg-accent-500 text-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 font-medium flex items-center space-x-2 hover:scale-105"
              >
                <span className="text-lg">💬</span>
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Quick Actions */}
        {(o2harBreached || unserviceabilityBreached) && (
          <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-4 md:p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <button
                onClick={handleCallDEs}
                className="px-4 py-3 bg-accent-500 text-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 font-medium flex items-center justify-center space-x-2 hover:scale-105"
              >
                <span className="text-lg">📞</span>
                <span className="text-sm">Call DEs</span>
              </button>
              <button
                onClick={handleIncreaseSurge}
                className="px-4 py-3 bg-error-500 text-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 font-medium flex items-center justify-center space-x-2 hover:scale-105"
              >
                <span className="text-lg">💰</span>
                <span className="text-sm">Increase Surge</span>
              </button>
              <button
                onClick={handleEmailPodOwner}
                className="px-4 py-3 bg-dark-hover border border-dark-border text-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 font-medium flex items-center justify-center space-x-2 hover:scale-105"
              >
                <span className="text-lg">📧</span>
                <span className="text-sm">Email Owner</span>
              </button>
            </div>
          </div>
        )}

        {/* Current Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">O2HAR</h3>
              <div className={`w-4 h-4 rounded-full ${o2harBreached ? 'bg-error-500' : 'bg-success-500'}`}></div>
            </div>
            <div className="text-center">
              <div className={`text-3xl md:text-4xl font-bold ${o2harBreached ? 'text-error-500' : 'text-success-500'}`}>
                {currentPod.o2har.toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Minutes</div>
              <div className="text-xs text-gray-500 mt-1">Threshold: {THRESHOLDS.O2HAR} Mins</div>
            </div>
          </div>
          
          <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Unserviceability</h3>
              <div className={`w-4 h-4 rounded-full ${unserviceabilityBreached ? 'bg-error-500' : 'bg-success-500'}`}></div>
            </div>
            <div className="text-center">
              <div className={`text-3xl md:text-4xl font-bold ${unserviceabilityBreached ? 'text-error-500' : 'text-success-500'}`}>
                {currentPod.unserviceability.toFixed(1)}%
              </div>
              <div className="text-gray-400 text-sm">Percentage</div>
              <div className="text-xs text-gray-500 mt-1">Threshold: {THRESHOLDS.UNSERVICEABILITY}%</div>
            </div>
          </div>
        </div>

        {/* Hourly Metrics Charts (Collapsible) */}
        <div className="mb-4 md:mb-6 space-y-3 md:space-y-4">
          <CollapsibleSection title="O2HAR Chart">
            <MetricsChart
              todayMetrics={currentPod.hourly_metrics || []}
              yesterdayMetrics={currentPod.hourly_metrics_yesterday || []}
              sdlwMetrics={currentPod.hourly_metrics_sdlw || []}
              metricType="o2har"
            />
          </CollapsibleSection>
          <CollapsibleSection title="Unserviceability Chart">
            <MetricsChart
              todayMetrics={currentPod.hourly_metrics || []}
              yesterdayMetrics={currentPod.hourly_metrics_yesterday || []}
              sdlwMetrics={currentPod.hourly_metrics_sdlw || []}
              metricType="unserviceability"
            />
          </CollapsibleSection>
        </div>

        {/* Root Causes & Recommendations */}
        <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Analysis & Recommendations</h2>
            {/* Root Causes */}
            {currentPod.root_causes_details && (
              <div className="mb-4 md:mb-6">
                <h3 className="text-md font-medium text-white mb-3 md:mb-4">Root Causes</h3>
                <div className="bg-error-500/10 border border-error-500/20 rounded-xl p-4 md:p-6 text-white">
                  <div className="space-y-3 md:space-y-4">
                    {currentPod.root_causes_details.map((cause, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-dark-hover rounded-xl border border-error-500/20 space-y-2 md:space-y-0 text-white">
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className="w-3 h-3 bg-error-500 rounded-full flex-shrink-0"></div>
                          <span className="text-white font-medium text-sm md:text-base">{cause.description}</span>
                        </div>
                                                  <div className="text-left md:text-right">
                            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
                              <span className="text-white font-semibold text-base md:text-lg">{cause.actual} {cause.unit}</span>
                              <span className="text-white text-xs md:text-sm">vs expected</span>
                              <span className="text-white font-semibold text-base md:text-lg">{cause.expected} {cause.unit}</span>
                            </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs md:text-sm font-medium ${cause.percent_diff > 0 ? 'text-error-500' : 'text-success-500'}`}>
                              {cause.percent_diff > 0 ? '↗' : '↘'} {Math.abs(cause.percent_diff)}%
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${cause.percent_diff > 0 ? 'bg-error-500/20 text-error-400' : 'bg-success-500/20 text-success-400'}`}>
                              {cause.percent_diff > 0 ? 'Increase' : 'Decrease'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Surge Pricing Table */}
            {currentPod.surge_table && (
              <div>
                <h3 className="text-md font-medium text-white mb-3 md:mb-4">Surge Pricing Recommendations</h3>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft overflow-hidden min-w-[600px] md:min-w-full">
                    <table className="w-full">
                      <thead className="bg-dark-hover">
                        <tr>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[120px]">Cohort</th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[100px]">Current Price</th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[100px]">Recommended Price</th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[120px]">Action Taken</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border">
                        {currentPod.surge_table.map((row, index) => {
                          const isActionTaken = surgeActions[row.cohort] || false;
                          
                          return (
                            <tr key={index} className={`${index % 2 === 0 ? 'bg-dark-card' : 'bg-dark-hover'} hover:bg-dark-border transition-colors duration-200`}>
                              <td className="px-2 md:px-6 py-3 md:py-4 text-sm font-medium text-white min-w-[120px]">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0"></div>
                                  <span className="text-xs">{row.cohort}</span>
                                </div>
                              </td>
                              <td className="px-2 md:px-6 py-3 md:py-4 text-sm text-gray-300 min-w-[100px]">
                                <div className="flex flex-col space-y-1">
                                  <span className="text-sm md:text-lg font-semibold text-white">₹{row.current_surge_rupees}</span>
                                  <span className="text-xs text-gray-400">per order</span>
                                </div>
                              </td>
                              <td className="px-2 md:px-6 py-3 md:py-4 text-sm text-gray-300 min-w-[100px]">
                                <div className="flex flex-col space-y-1">
                                  <span className="text-sm md:text-lg font-semibold text-white">₹{row.recommended_surge_rupees}</span>
                                  <span className="text-xs text-gray-400">per order</span>
                                </div>
                              </td>
                              <td className="px-2 md:px-6 py-3 md:py-4 text-sm min-w-[120px]">
                                <button
                                  onClick={() => handleSurgeActionToggle(row.cohort)}
                                  className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                                    isActionTaken
                                      ? 'bg-success-500/20 text-success-400 border border-success-500/30'
                                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-accent-500/20 hover:text-accent-400 hover:border-accent-500/30'
                                  }`}
                                >
                                  {isActionTaken ? '✓ Done' : 'Mark Done'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {/* Workforce Table */}
            {currentPod.workforce_table && (
              <div>
                <h3 className="text-md font-medium text-white mb-3 md:mb-4">Workforce Management</h3>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft overflow-hidden min-w-[600px] md:min-w-full">
                    <table className="w-full">
                      <thead className="bg-dark-hover">
                        <tr>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[120px]">Cohort</th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[80px]">DEs Needed</th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[80px]">Current DEs</th>
                          <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[80px]">Gap</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border">
                        {currentPod.workforce_table.map((row, index) => (
                          <tr key={index} className={`${index % 2 === 0 ? 'bg-dark-card' : 'bg-dark-hover'} hover:bg-dark-border transition-colors duration-200`}>
                            <td className="px-2 md:px-6 py-3 md:py-4 text-sm font-medium text-white min-w-[120px]">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0"></div>
                                <span className="text-xs">{row.cohort}</span>
                              </div>
                            </td>
                            <td className="px-2 md:px-6 py-3 md:py-4 text-sm text-gray-300 min-w-[80px]">
                              <span className="text-sm md:text-lg font-semibold text-white">{row.needed}</span>
                            </td>
                            <td className="px-2 md:px-6 py-3 md:py-4 text-sm text-gray-300 min-w-[80px]">
                              <span className="text-sm md:text-lg font-semibold text-white">{row.current}</span>
                            </td>
                            <td className="px-2 md:px-6 py-3 md:py-4 text-sm min-w-[80px]">
                              <div className="flex flex-col space-y-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                  row.gap > 0 
                                    ? 'bg-error-500/20 text-error-400' 
                                    : 'bg-success-500/20 text-success-400'
                                }`}>
                                  {row.gap > 0 ? '⚠' : '✓'} {row.gap > 0 ? '+' : ''}{row.gap}
                                </span>
                                <span className={`text-xs font-medium ${
                                  row.gap > 0 
                                    ? 'text-error-500' 
                                    : 'text-success-500'
                                }`}>
                                  {row.gap > 0 ? 'Shortage' : 'Sufficient'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* ChatBot */}
        <ChatBot isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
      </div>
    </div>
  );
};

export default PodDetail; 
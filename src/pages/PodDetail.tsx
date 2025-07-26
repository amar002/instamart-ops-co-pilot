import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PodData } from '../types';
import { getPodTrend, isMetricBreached } from '../utils/helpers';
import { THRESHOLDS } from '../utils/constants';
import ChatBot from '../components/ChatBot';
import MetricsChart from '../components/MetricsChart';
import DarkModeToggle from '../components/DarkModeToggle';
import CollapsibleSection from '../components/CollapsibleSection';

const PodDetail: React.FC = () => {
  const { podId } = useParams<{ podId: string }>();
  const navigate = useNavigate();
  const [podTrend, setPodTrend] = useState<PodData[]>([]);
  const [currentPod, setCurrentPod] = useState<PodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const fetchPodData = async () => {
      try {
        const response = await fetch('/data/pods.json');
        const data = await response.json();
        const trend = getPodTrend(data, podId!);
        setPodTrend(trend);
        setCurrentPod(trend[0] || null);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-instamart-blue hover:text-blue-600 mb-2 flex items-center"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentPod.pod_name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentPod.zone}, {currentPod.city}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Owner: {currentPod.pod_owner_name} (<a href={`mailto:${currentPod.pod_owner_email}`} className="text-instamart-blue underline">{currentPod.pod_owner_email}</a>)</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${(o2harBreached || unserviceabilityBreached) ? 'bg-instamart-red' : 'bg-instamart-green'}`}></div>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Current Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">O2HAR</p>
              <p className={`text-3xl font-bold ${o2harBreached ? 'text-instamart-red' : 'text-instamart-green'}`}>
                {currentPod.o2har} Mins
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Threshold: {THRESHOLDS.O2HAR} Mins</p>
              {o2harBreached && (
                <p className="text-xs text-instamart-red mt-1">⚠️ Threshold Breached</p>
              )}
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Unserviceability</p>
              <p className={`text-3xl font-bold ${unserviceabilityBreached ? 'text-instamart-red' : 'text-instamart-green'}`}>
                {currentPod.unserviceability}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Threshold: {THRESHOLDS.UNSERVICEABILITY}%</p>
              {unserviceabilityBreached && (
                <p className="text-xs text-instamart-red mt-1">⚠️ Threshold Breached</p>
              )}
            </div>
          </div>
        </div>

        {/* Hourly Metrics Charts (Collapsible) */}
        {currentPod.hourly_metrics && currentPod.hourly_metrics_yesterday && currentPod.hourly_metrics_sdlw && (
          <div className="mb-6 space-y-4">
            <CollapsibleSection title="O2HAR Chart">
              <MetricsChart
                todayMetrics={currentPod.hourly_metrics}
                yesterdayMetrics={currentPod.hourly_metrics_yesterday}
                sdlwMetrics={currentPod.hourly_metrics_sdlw}
                metricType="o2har"
              />
            </CollapsibleSection>
            <CollapsibleSection title="Unserviceability Chart">
              <MetricsChart
                todayMetrics={currentPod.hourly_metrics}
                yesterdayMetrics={currentPod.hourly_metrics_yesterday}
                sdlwMetrics={currentPod.hourly_metrics_sdlw}
                metricType="unserviceability"
              />
            </CollapsibleSection>
          </div>
        )}

        {/* Root Causes & Recommendations */}
        {(o2harBreached || unserviceabilityBreached) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analysis & Recommendations</h2>
            {/* Root Causes */}
            {currentPod.root_causes_details && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Root Causes</h3>
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                  <div className="space-y-3">
                    {currentPod.root_causes_details.map((cause, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                          <span className="text-red-800 dark:text-red-200">{cause.description}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-red-800 dark:text-red-200 font-semibold">{cause.actual} {cause.unit}</span>
                          <span className="text-red-600 dark:text-red-300"> vs expected </span>
                          <span className="text-red-800 dark:text-red-200 font-semibold">{cause.expected} {cause.unit}</span>
                          <span className={`ml-2 font-semibold ${cause.percent_diff > 0 ? 'text-red-600 dark:text-red-300' : 'text-green-600 dark:text-green-300'}`}>({cause.percent_diff > 0 ? '+' : ''}{cause.percent_diff}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Surge Table */}
            {currentPod.surge_table && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Surge Pricing Recommendations</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cohort</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current Surge (₹)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Recommended Surge (₹)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Multiplier</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentPod.surge_table.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">{row.cohort}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-200">₹{row.current_surge_rupees} <span className="ml-1 text-xs text-gray-400 dark:text-gray-300">({row.existing_surge}x)</span></td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-200">₹{row.recommended_surge_rupees} <span className="ml-1 text-xs text-gray-400 dark:text-gray-300">({row.recommended_surge}x)</span></td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-200">{row.existing_surge}x → {row.recommended_surge}x</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`inline-block px-2 py-1 rounded font-semibold ${row.recommended_surge > row.existing_surge ? 'bg-instamart-red text-white' : 'bg-instamart-green text-white'}`}>{row.recommended_surge > row.existing_surge ? '+' : ''}{((row.recommended_surge_rupees! - row.current_surge_rupees!) / row.current_surge_rupees! * 100).toFixed(0)}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Workforce Table */}
            {currentPod.workforce_table && (
              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Workforce Management</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cohort</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">DEs Needed</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current DEs</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentPod.workforce_table.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">{row.cohort}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-200">{row.needed}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-200">{row.current}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`font-semibold ${row.gap > 0 ? 'text-instamart-red' : 'text-instamart-green'}`}>{row.gap > 0 ? '+' : ''}{row.gap}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ChatBot */}
        <ChatBot isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
      </div>
    </div>
  );
};

export default PodDetail; 
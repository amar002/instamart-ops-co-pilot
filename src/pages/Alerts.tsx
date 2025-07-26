import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, PodData } from '../types';
import { getLatestPodData } from '../utils/helpers';
import DarkModeToggle from '../components/DarkModeToggle';

const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const [pods, setPods] = useState<PodData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [formData, setFormData] = useState({
    podId: '',
    metric: 'o2har' as 'o2har' | 'unserviceability',
    condition: '>' as '>' | '<',
    threshold: '',
  });

  useEffect(() => {
    // Load pods
    const fetchPods = async () => {
      try {
        const response = await fetch('/data/pods.json');
        const data = await response.json();
        const latestPods = getLatestPodData(data);
        setPods(latestPods);
        if (latestPods.length > 0) {
          setFormData(prev => ({ ...prev, podId: latestPods[0].pod_id }));
        }
      } catch (error) {
        console.error('Error fetching pods:', error);
      }
    };

    // Load saved alerts from localStorage
    const savedAlerts = localStorage.getItem('instamart-alerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }

    fetchPods();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.podId || !formData.threshold) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      podId: formData.podId,
      metric: formData.metric,
      condition: formData.condition,
      threshold: parseFloat(formData.threshold),
      isActive: true,
    };

    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    localStorage.setItem('instamart-alerts', JSON.stringify(updatedAlerts));

    // Reset form
    setFormData({
      podId: formData.podId,
      metric: 'o2har',
      condition: '>',
      threshold: '',
    });
  };

  const toggleAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    );
    setAlerts(updatedAlerts);
    localStorage.setItem('instamart-alerts', JSON.stringify(updatedAlerts));
  };

  const deleteAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    localStorage.setItem('instamart-alerts', JSON.stringify(updatedAlerts));
  };

  const getPodName = (podId: string) => {
    const pod = pods.find(p => p.pod_id === podId);
    return pod ? pod.pod_name : podId;
  };

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alert Setup</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configure metric alerts for pods</p>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Create Alert Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Alert</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pod
                </label>
                <select
                  value={formData.podId}
                  onChange={(e) => setFormData(prev => ({ ...prev, podId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-instamart-blue focus:border-transparent"
                  required
                >
                  <option value="">Select a pod</option>
                  {pods.map((pod) => (
                    <option key={pod.pod_id} value={pod.pod_id}>
                      {pod.pod_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Metric
                </label>
                <select
                  value={formData.metric}
                  onChange={(e) => setFormData(prev => ({ ...prev, metric: e.target.value as 'o2har' | 'unserviceability' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-instamart-blue focus:border-transparent"
                >
                  <option value="o2har">O2HAR</option>
                  <option value="unserviceability">Unserviceability</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as '>' | '<' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-instamart-blue focus:border-transparent"
                >
                  <option value=">">Greater than</option>
                  <option value="<">Less than</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Threshold
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.threshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-instamart-blue focus:border-transparent"
                  placeholder={formData.metric === 'o2har' ? '9.0 Mins' : '5.0%'}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-instamart-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Alert
            </button>
          </form>
        </div>

        {/* Saved Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No alerts configured yet</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${alert.isActive ? 'bg-instamart-green' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getPodName(alert.podId)} - {alert.metric.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {alert.condition} {alert.threshold}
                          {alert.metric === 'unserviceability' ? '%' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        alert.isActive
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-instamart-green text-white hover:bg-green-600'
                      }`}
                    >
                      {alert.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="px-3 py-1 bg-instamart-red text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts; 
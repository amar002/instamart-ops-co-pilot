import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PodData, Alert } from '../types';
import { getLatestPodData } from '../utils/helpers';

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
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Alert Management
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Set up and manage metric alerts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create Alert Form */}
        <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Create New Alert</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Pod
                </label>
                <select
                  value={formData.podId}
                  onChange={(e) => setFormData(prev => ({ ...prev, podId: e.target.value }))}
                  className="w-full px-4 py-3 border border-dark-border bg-dark-hover text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-white mb-3">
                  Metric
                </label>
                <select
                  value={formData.metric}
                  onChange={(e) => setFormData(prev => ({ ...prev, metric: e.target.value as 'o2har' | 'unserviceability' }))}
                  className="w-full px-4 py-3 border border-dark-border bg-dark-hover text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value="o2har">O2HAR</option>
                  <option value="unserviceability">Unserviceability</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as '>' | '<' }))}
                  className="w-full px-4 py-3 border border-dark-border bg-dark-hover text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  <option value=">">Greater than</option>
                  <option value="<">Less than</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Threshold
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.threshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
                  className="w-full px-4 py-3 border border-dark-border bg-dark-hover text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent-500 text-white py-3 px-6 rounded-xl hover:shadow-medium transition-all duration-200 font-medium hover:scale-105"
            >
              Create Alert
            </button>
          </form>
        </div>

        {/* Saved Alerts */}
        <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-bold text-white mb-6">Saved Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No alerts configured</p>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-dark-hover border border-dark-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-white font-medium">{getPodName(alert.podId)}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400 capitalize">{alert.metric}</span>
                      <span className="text-gray-400">{alert.condition}</span>
                      <span className="text-white font-semibold">{alert.threshold}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {alert.metric === 'o2har' ? 'Minutes' : 'Percentage'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        alert.isActive
                          ? 'bg-success-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="bg-error-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-error-600 transition-colors"
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
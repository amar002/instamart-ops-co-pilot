import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PodData } from '../types';
import ChatBot from '../components/ChatBot';
import { THRESHOLDS } from '../utils/constants';

interface PodWithAction extends PodData {
  actionLog: string;
}

const getCityActionLogKey = (city: string) => `city-action-log-${city}`;
const getPodActionLogKey = (podId: string) => `pod-action-log-${podId}`;

const CityPods: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const [pods, setPods] = useState<PodWithAction[]>([]);
  const [cityOwner, setCityOwner] = useState<{ name: string; email: string } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [cityO2har, setCityO2har] = useState<number>(0);
  const [cityUnserviceability, setCityUnserviceability] = useState<number>(0);
  const [breachedPods, setBreachedPods] = useState<number>(0);
  const [cityActionLog, setCityActionLog] = useState<string>('');
  const [chatOpen, setChatOpen] = useState(false);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const response = await fetch('/data/pods.json');
        const data: PodData[] = await response.json();
        // Get latest pod per pod_id for this city
        const podMap = new Map<string, PodData>();
        data.filter(p => p.city === cityName).forEach(pod => {
          if (!podMap.has(pod.pod_id) || new Date(pod.date) > new Date(podMap.get(pod.pod_id)!.date)) {
            podMap.set(pod.pod_id, pod);
          }
        });
        const podsArr = Array.from(podMap.values());
        // Add action logs from localStorage
        const podsWithAction: PodWithAction[] = podsArr.map(pod => ({
          ...pod,
          actionLog: localStorage.getItem(getPodActionLogKey(pod.pod_id)) || '',
        }));
        setPods(podsWithAction);
        if (podsArr.length > 0) {
          setCityOwner({ name: podsArr[0].city_owner_name, email: podsArr[0].city_owner_email });
          // Aggregate city metrics
          let o2har = 0, unserviceability = 0, breached = 0, last = podsArr[0].date;
          podsArr.forEach(pod => {
            o2har += pod.o2har;
            unserviceability += pod.unserviceability;
            if (pod.o2har > THRESHOLDS.O2HAR || pod.unserviceability > THRESHOLDS.UNSERVICEABILITY) breached++;
            if (new Date(pod.date) > new Date(last)) last = pod.date;
          });
          setCityO2har(o2har / podsArr.length);
          setCityUnserviceability(unserviceability / podsArr.length);
          setBreachedPods(breached);
          setLastUpdated(new Date(last).toLocaleString());
        }
        setCityActionLog(localStorage.getItem(getCityActionLogKey(cityName!)) || '');
      } catch (e) {
        setPods([]);
      } finally {
        setLoading(false);
      }
    };
    if (cityName) fetchPods();
  }, [cityName]);

  const handlePodActionChange = (podId: string, value: string) => {
    setPods(prev => prev.map(p => p.pod_id === podId ? { ...p, actionLog: value } : p));
    localStorage.setItem(getPodActionLogKey(podId), value);
  };

  const handleCityActionChange = (value: string) => {
    setCityActionLog(value);
    localStorage.setItem(getCityActionLogKey(cityName!), value);
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
                <span>Back to All Cities</span>
              </button>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-white">{cityName}</h1>
              {cityOwner && (
                <p className="text-gray-400 text-sm mt-1">
                  Owner: {cityOwner.name} (
                  <a 
                    href={`mailto:${cityOwner.email}`} 
                    className="text-accent-500 hover:text-accent-400 underline transition-colors"
                  >
                    {cityOwner.email}
                  </a>
                  )
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setChatOpen(true)}
                className="px-4 py-2 bg-accent-500 text-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 font-medium flex items-center space-x-2 hover:scale-105"
              >
                <span className="text-lg">💬</span>
                <span className="hidden sm:inline">Ask AI</span>
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-400">Last Updated</div>
                <div className="text-xs text-gray-500">{lastUpdated}</div>
                <div className="text-xs text-gray-500">(hourly)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* City Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-6 flex flex-col items-center hover:shadow-medium transition-all duration-200">
            <span className="text-sm text-gray-400 mb-2 font-medium">O2HAR</span>
            <span className={`text-3xl font-bold ${cityO2har > THRESHOLDS.O2HAR ? 'text-error-500' : 'text-success-500'}`}>{cityO2har.toFixed(1)} Mins</span>
            <span className="text-xs text-gray-500">Threshold: {THRESHOLDS.O2HAR} Mins</span>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-6 flex flex-col items-center hover:shadow-medium transition-all duration-200">
            <span className="text-sm text-gray-400 mb-2 font-medium">Unserviceability</span>
            <span className={`text-3xl font-bold ${cityUnserviceability > THRESHOLDS.UNSERVICEABILITY ? 'text-error-500' : 'text-success-500'}`}>{cityUnserviceability.toFixed(1)}%</span>
            <span className="text-xs text-gray-500">Threshold: {THRESHOLDS.UNSERVICEABILITY}%</span>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-6 flex flex-col items-center hover:shadow-medium transition-all duration-200">
            <span className="text-sm text-gray-400 mb-2 font-medium">Pods Breaching</span>
            <span className="text-3xl font-bold text-error-500">{breachedPods}</span>
            <span className="text-xs text-gray-500">of {pods.length} pods</span>
          </div>
        </div>

        {/* City Action Log */}
        <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-6 mb-6">
          <label className="block text-sm font-medium text-white mb-3">City Owner Action Log</label>
          <textarea
            className="w-full px-4 py-3 border border-dark-border bg-dark-hover text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent placeholder-gray-400"
            rows={3}
            value={cityActionLog}
            onChange={e => handleCityActionChange(e.target.value)}
            placeholder="What is being done at the city level?"
          />
        </div>
      </div>

      {/* Pods List */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <h2 className="text-xl font-bold text-white mb-6">Pods in {cityName}</h2>
        <div className="space-y-6">
          {pods.map(pod => (
            <div key={pod.pod_id} className="bg-dark-card border border-dark-border rounded-xl shadow-soft flex flex-col md:flex-row items-start md:items-center p-6 gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <button 
                      onClick={() => navigate(`/pod/${pod.pod_id}`)}
                      className="text-lg font-semibold text-white hover:text-accent-400 transition-colors cursor-pointer"
                    >
                      {pod.pod_name}
                    </button>
                    <span className="ml-3 text-sm text-gray-400">{pod.zone}</span>
                  </div>
                  <button onClick={() => navigate(`/pod/${pod.pod_id}`)} className="text-accent-500 hover:text-accent-400 text-sm font-medium underline transition-colors">Details</button>
                </div>
                <div className="text-sm text-gray-400 mb-3">Owner: {pod.pod_owner_name} (<a href={`mailto:${pod.pod_owner_email}`} className="text-accent-500 hover:text-accent-400 underline transition-colors">{pod.pod_owner_email}</a>)</div>
                <div className="flex gap-8 mb-4">
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">O2HAR</span>
                    <span className={`font-bold text-lg ${pod.o2har > THRESHOLDS.O2HAR ? 'text-error-500' : 'text-success-500'}`}>{pod.o2har} Mins</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">Unserviceability</span>
                                          <span className={`font-bold text-lg ${pod.unserviceability > THRESHOLDS.UNSERVICEABILITY ? 'text-error-500' : 'text-success-500'}`}>{pod.unserviceability}%</span>
                  </div>
                </div>
                <label className="block text-sm text-white mb-2">Pod Owner Action Log</label>
                <textarea
                  className="w-full px-4 py-3 border border-dark-border bg-dark-hover text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent placeholder-gray-400"
                  rows={2}
                  value={pod.actionLog}
                  onChange={e => handlePodActionChange(pod.pod_id, e.target.value)}
                  placeholder="What is being done at the pod level?"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ChatBot */}
      <ChatBot isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  );
};

export default CityPods; 
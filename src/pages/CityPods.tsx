import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PodData } from '../types';
import DarkModeToggle from '../components/DarkModeToggle';

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
  const [loading, setLoading] = useState(true);

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
            if (pod.o2har > 9.0 || pod.unserviceability > 5.0) breached++;
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <button onClick={() => navigate('/')} className="text-instamart-blue hover:text-blue-600 mb-2 flex items-center">← Back to All Cities</button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{cityName}</h1>
            {cityOwner && (
              <p className="text-xs text-gray-500 dark:text-gray-400">Owner: {cityOwner.name} (<a href={`mailto:${cityOwner.email}`} className="text-instamart-blue underline">{cityOwner.email}</a>)</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-600 dark:text-gray-400 text-right">
              <span className="block">Updated: <span className="font-semibold text-gray-800 dark:text-gray-200">{lastUpdated}</span></span>
              <span className="block">(hourly)</span>
            </div>
            <DarkModeToggle />
          </div>
        </div>
      </div>

      {/* City Metrics Summary */}
      <div className="max-w-4xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">O2HAR</span>
          <span className={`text-2xl font-bold ${cityO2har > 9.0 ? 'text-instamart-red' : 'text-instamart-green'}`}>{cityO2har.toFixed(1)} Mins</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Threshold: 9.0 Mins</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Unserviceability</span>
          <span className={`text-2xl font-bold ${cityUnserviceability > 5.0 ? 'text-instamart-red' : 'text-instamart-green'}`}>{cityUnserviceability.toFixed(1)}%</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">Threshold: 5.0%</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pods Breaching</span>
          <span className="text-2xl font-bold text-instamart-red">{breachedPods}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">of {pods.length} pods</span>
        </div>
      </div>

      {/* City Action Log */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City Owner Action Log</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-instamart-blue focus:border-transparent"
            rows={2}
            value={cityActionLog}
            onChange={e => handleCityActionChange(e.target.value)}
            placeholder="What is being done at the city level?"
          />
        </div>
      </div>

      {/* Pods List */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pods in {cityName}</h2>
        <div className="space-y-4">
          {pods.map(pod => (
            <div key={pod.pod_id} className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col md:flex-row items-start md:items-center p-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{pod.pod_name}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{pod.zone}</span>
                  </div>
                  <button onClick={() => navigate(`/pod/${pod.pod_id}`)} className="text-instamart-blue text-xs underline ml-2">Details</button>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Owner: {pod.pod_owner_name} (<a href={`mailto:${pod.pod_owner_email}`} className="text-instamart-blue underline">{pod.pod_owner_email}</a>)</div>
                <div className="flex gap-6 mb-2">
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">O2HAR</span>
                    <span className={`font-bold ${pod.o2har > 9.0 ? 'text-instamart-red' : 'text-instamart-green'}`}>{pod.o2har} Mins</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">Unserviceability</span>
                    <span className={`font-bold ${pod.unserviceability > 5.0 ? 'text-instamart-red' : 'text-instamart-green'}`}>{pod.unserviceability}%</span>
                  </div>
                </div>
                <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">Pod Owner Action Log</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-instamart-blue focus:border-transparent"
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
    </div>
  );
};

export default CityPods; 
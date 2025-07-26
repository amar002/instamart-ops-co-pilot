import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HourlyMetric {
  hour: string;
  o2har: number;
  unserviceability: number;
  date: string;
}

interface MetricsChartProps {
  todayMetrics: HourlyMetric[];
  yesterdayMetrics: HourlyMetric[];
  sdlwMetrics: HourlyMetric[];
  metricType: 'o2har' | 'unserviceability';
}

const MetricsChart: React.FC<MetricsChartProps> = ({ todayMetrics, yesterdayMetrics, sdlwMetrics, metricType }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${metricType.toUpperCase()}${metricType === 'o2har' ? ' (Mins)' : ' (%)'} - Hourly Trend`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels: todayMetrics.map(m => m.hour),
    datasets: [
      {
        label: 'Today',
        data: todayMetrics.map(m => m[metricType]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: 'Yesterday',
        data: yesterdayMetrics.map(m => m[metricType]),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: 'Same Day Last Week',
        data: sdlwMetrics.map(m => m[metricType]),
        borderColor: 'rgb(107, 114, 128)',
        backgroundColor: 'rgba(107, 114, 128, 0.5)',
        borderWidth: 2,
        borderDash: [2, 2],
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <Line options={options} data={data} />
    </div>
  );
};

export default MetricsChart; 
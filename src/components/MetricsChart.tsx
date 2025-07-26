import React from 'react';
import { Line } from 'react-chartjs-2';
// @ts-ignore
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      title: {
        display: true,
        text: `${metricType.toUpperCase()}${metricType === 'o2har' ? ' (Mins)' : ' (%)'} - Hourly Trend`,
        color: '#ffffff',
        font: {
          size: window.innerWidth < 768 ? 14 : 16,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2d2d44',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: window.innerWidth < 768 ? 11 : 13,
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 10 : 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
          padding: 8,
        },
        border: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: window.innerWidth < 768 ? 9 : 11,
          },
          padding: 8,
          maxRotation: window.innerWidth < 768 ? 45 : 0,
          minRotation: window.innerWidth < 768 ? 45 : 0,
        },
        border: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      point: {
        radius: window.innerWidth < 768 ? 3 : 4,
        hoverRadius: window.innerWidth < 768 ? 5 : 6,
        borderWidth: 2,
      },
      line: {
        tension: 0.3,
      },
    },
  };

  const data = {
    labels: todayMetrics.map(m => m.hour),
    datasets: [
      {
        label: 'Today',
        data: todayMetrics.map(m => m[metricType]),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
      },
      {
        label: 'Yesterday',
        data: yesterdayMetrics.map(m => m[metricType]),
        borderColor: '#9ca3af',
        backgroundColor: 'rgba(156, 163, 175, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointBackgroundColor: '#9ca3af',
        pointBorderColor: '#ffffff',
      },
      {
        label: 'Same Day Last Week',
        data: sdlwMetrics.map(m => m[metricType]),
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.2)',
        borderWidth: 2,
        borderDash: [2, 2],
        fill: false,
        pointBackgroundColor: '#6b7280',
        pointBorderColor: '#ffffff',
      },
    ],
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl shadow-soft p-4 md:p-6">
      <div className="w-full h-64 md:h-80 lg:h-96">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default MetricsChart; 
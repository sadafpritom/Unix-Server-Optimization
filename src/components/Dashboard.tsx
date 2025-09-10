import React from 'react';
import { Cpu, MemoryStick, HardDrive, Network, Activity, Thermometer, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import MetricCard from './MetricCard';
import Chart from './Chart';
import ProcessTable from './ProcessTable';
import OptimizationSuggestions from './OptimizationSuggestions';

interface DashboardProps {
  data: any;
  theme: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, theme }) => {
  const { metrics, history } = data;

  const metricCards = [
    {
      title: 'CPU Usage',
      value: `${metrics.cpu.usage.toFixed(1)}%`,
      change: '+2.3%',
      trend: 'up',
      icon: Cpu,
      color: 'blue',
      details: [
        { label: 'Cores', value: metrics.cpu.cores },
        { label: 'Temperature', value: `${metrics.cpu.temperature.toFixed(1)}°C` }
      ]
    },
    {
      title: 'Memory',
      value: `${((metrics.memory.used / metrics.memory.total) * 100).toFixed(1)}%`,
      change: '+0.8%',
      trend: 'up',
      icon: MemoryStick,
      color: 'green',
      details: [
        { label: 'Used', value: `${(metrics.memory.used / 1024).toFixed(1)} GB` },
        { label: 'Available', value: `${(metrics.memory.available / 1024).toFixed(1)} GB` }
      ]
    },
    {
      title: 'Disk Usage',
      value: `${((metrics.disk.used / metrics.disk.total) * 100).toFixed(1)}%`,
      change: '+0.1%',
      trend: 'up',
      icon: HardDrive,
      color: 'purple',
      details: [
        { label: 'Read', value: `${metrics.disk.read.toFixed(1)} MB/s` },
        { label: 'Write', value: `${metrics.disk.write.toFixed(1)} MB/s` }
      ]
    },
    {
      title: 'Network',
      value: `${metrics.network.connections}`,
      change: '-1.2%',
      trend: 'down',
      icon: Network,
      color: 'orange',
      details: [
        { label: 'In', value: `${(metrics.network.bytesIn / 1000000).toFixed(1)} MB` },
        { label: 'Out', value: `${(metrics.network.bytesOut / 1000000).toFixed(1)} MB` }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <MetricCard key={index} {...card} theme={theme} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark'
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
            : 'bg-white/50 backdrop-blur-xl border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              CPU & Memory Trends
            </h3>
            <TrendingUp className={`h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </div>
          <Chart
            data={history}
            metrics={['cpu', 'memory']}
            height={300}
            theme={theme}
          />
        </div>

        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark'
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
            : 'bg-white/50 backdrop-blur-xl border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Disk & Network Activity
            </h3>
            <Activity className={`h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </div>
          <Chart
            data={history}
            metrics={['disk', 'network']}
            height={300}
            theme={theme}
          />
        </div>
      </div>

      {/* Process Table and Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProcessTable processes={metrics.processes} theme={theme} />
        <OptimizationSuggestions theme={theme} />
      </div>
    </div>
  );
};

export default Dashboard;
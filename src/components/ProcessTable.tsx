import React from 'react';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: string;
}

interface ProcessTableProps {
  processes: Process[];
  theme: string;
}

const ProcessTable: React.FC<ProcessTableProps> = ({ processes, theme }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className={`rounded-2xl p-6 transition-colors ${
      theme === 'dark'
        ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
        : 'bg-white/50 backdrop-blur-xl border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Top Processes
        </h3>
        <Activity className={`h-5 w-5 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`} />
      </div>

      <div className="overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className={`text-xs font-medium ${
              theme === 'dark'
                ? 'bg-gray-700/50 text-gray-300'
                : 'bg-gray-100 text-gray-600'
            }`}>
              <th className="px-4 py-3 text-left">Process</th>
              <th className="px-4 py-3 text-right">CPU %</th>
              <th className="px-4 py-3 text-right">Memory</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {processes.map((process) => (
              <tr key={process.pid} className={`transition-colors hover:${
                theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
              }`}>
                <td className="px-4 py-3">
                  <div>
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {process.name}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      PID: {process.pid}
                    </div>
                  </div>
                </td>
                <td className={`px-4 py-3 text-right font-mono text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {process.cpu.toFixed(1)}%
                </td>
                <td className={`px-4 py-3 text-right font-mono text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {process.memory.toFixed(0)} MB
                </td>
                <td className="px-4 py-3 text-center">
                  {getStatusIcon(process.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessTable;
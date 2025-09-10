import React, { useState } from 'react';
import { FileText, Filter, Download, Search } from 'lucide-react';

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
}

interface LogsProps {
  logs: LogEntry[];
  theme: string;
}

const Logs: React.FC<LogsProps> = ({ logs, theme }) => {
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'INFO':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'DEBUG':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'ALL' || log.level === filter;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.level.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const downloadLogs = () => {
    const logText = filteredLogs.map(log => 
      `[${new Date(log.timestamp).toISOString()}] ${log.level}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `server-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const levels = ['ALL', 'ERROR', 'WARNING', 'INFO', 'DEBUG'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          System Logs
        </h2>
        <button
          onClick={downloadLogs}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Download className="h-4 w-4" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <Filter className={`h-5 w-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <div className="flex space-x-1">
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                  filter === level
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['ERROR', 'WARNING', 'INFO', 'DEBUG'].map(level => {
          const count = logs.filter(log => log.level === level).length;
          return (
            <div key={level} className={`p-4 rounded-xl ${
              theme === 'dark'
                ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
                : 'bg-white/50 backdrop-blur-xl border border-gray-200'
            }`}>
              <div className="text-center">
                <div className={`text-2xl font-bold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {count}
                </div>
                <div className={`text-xs ${getLevelColor(level)} px-2 py-1 rounded-full inline-block`}>
                  {level}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Logs */}
      <div className={`rounded-2xl border transition-colors ${
        theme === 'dark'
          ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700'
          : 'bg-white/50 backdrop-blur-xl border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className={`h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Log Entries ({filteredLogs.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No logs match your current filter.</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start space-x-4 p-3 rounded-lg transition-colors hover:${
                    theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'
                  }`}
                >
                  <div className={`text-xs font-mono px-2 py-1 rounded ${getLevelColor(log.level)}`}>
                    {log.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-mono ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {log.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
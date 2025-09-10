import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Bell, BellOff } from 'lucide-react';

interface Alert {
  id: number;
  title: string;
  message: string;
  severity: string;
  timestamp: string;
  acknowledged: boolean;
}

interface AlertsProps {
  alerts: Alert[];
  theme: string;
}

const Alerts: React.FC<AlertsProps> = ({ alerts, theme }) => {
  const [filter, setFilter] = useState('all');

  const acknowledgeAlert = async (alertId: number) => {
    try {
      // Use mock data instead of API call
      const { mockDataGenerator } = await import('../utils/mockData');
      mockDataGenerator.acknowledgeAlert(alertId);
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unacknowledged') return !alert.acknowledged;
    if (filter === 'acknowledged') return alert.acknowledged;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          System Alerts
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unacknowledged')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unacknowledged'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unacknowledged
          </button>
          <button
            onClick={() => setFilter('acknowledged')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'acknowledged'
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Acknowledged
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${
          theme === 'dark'
            ? 'bg-red-900/20 border border-red-800'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className={`font-medium ${
              theme === 'dark' ? 'text-red-300' : 'text-red-700'
            }`}>
              Critical: {alerts.filter(a => a.severity === 'error').length}
            </span>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${
          theme === 'dark'
            ? 'bg-yellow-900/20 border border-yellow-800'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className={`font-medium ${
              theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              Warning: {alerts.filter(a => a.severity === 'warning').length}
            </span>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${
          theme === 'dark'
            ? 'bg-blue-900/20 border border-blue-800'
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <span className={`font-medium ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Info: {alerts.filter(a => a.severity === 'info').length}
            </span>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl ${
            theme === 'dark'
              ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
              : 'bg-white/50 backdrop-blur-xl border border-gray-200'
          }`}>
            <BellOff className={`h-12 w-12 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <p className={`text-lg font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              No alerts found
            </p>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {filter === 'all' ? 'Your system is running smoothly.' : `No ${filter} alerts.`}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${getSeverityBg(alert.severity)} ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {alert.title}
                      </h3>
                      {alert.acknowledged && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className={`mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
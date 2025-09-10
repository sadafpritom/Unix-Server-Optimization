import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Mail, MessageSquare, Bell } from 'lucide-react';

interface SettingsProps {
  theme: string;
}

interface Thresholds {
  cpu: number;
  memory: number;
  disk: number;
  temperature: number;
}

const Settings: React.FC<SettingsProps> = ({ theme }) => {
  const [thresholds, setThresholds] = useState<Thresholds>({
    cpu: 80,
    memory: 85,
    disk: 90,
    temperature: 75
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    desktop: true
  });
  const [emailSettings, setEmailSettings] = useState({
    address: 'admin@example.com',
    smtp: 'smtp.example.com',
    port: '587'
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchThresholds();
  }, []);

  const fetchThresholds = async () => {
    try {
      // Use mock data instead of API call
      const { mockDataGenerator } = await import('../utils/mockData');
      const data = mockDataGenerator.getThresholds();
      setThresholds(data);
    } catch (error) {
      console.error('Failed to fetch thresholds:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Use mock data instead of API call
      const { mockDataGenerator } = await import('../utils/mockData');
      mockDataGenerator.updateThresholds(thresholds);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
    setLoading(false);
  };

  const resetToDefaults = () => {
    setThresholds({
      cpu: 80,
      memory: 85,
      disk: 90,
      temperature: 75
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          System Settings
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetToDefaults}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Save className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saved ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Thresholds */}
        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark'
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
            : 'bg-white/50 backdrop-blur-xl border border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-6">
            <SettingsIcon className={`h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Alert Thresholds
            </h3>
          </div>

          <div className="space-y-6">
            {[
              { key: 'cpu', label: 'CPU Usage', unit: '%', max: 100 },
              { key: 'memory', label: 'Memory Usage', unit: '%', max: 100 },
              { key: 'disk', label: 'Disk Usage', unit: '%', max: 100 },
              { key: 'temperature', label: 'CPU Temperature', unit: '°C', max: 100 }
            ].map(({ key, label, unit, max }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {label}
                  </label>
                  <span className={`text-sm font-mono ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {thresholds[key as keyof Thresholds]}{unit}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={max}
                    value={thresholds[key as keyof Thresholds]}
                    onChange={(e) => setThresholds({
                      ...thresholds,
                      [key]: parseInt(e.target.value)
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>{max}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark'
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
            : 'bg-white/50 backdrop-blur-xl border border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-6">
            <Bell className={`h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Notifications
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', icon: Mail },
              { key: 'sms', label: 'SMS Notifications', icon: MessageSquare },
              { key: 'desktop', label: 'Desktop Notifications', icon: Bell }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {label}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={(e) => setNotifications({
                      ...notifications,
                      [key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Email Configuration */}
        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark'
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
            : 'bg-white/50 backdrop-blur-xl border border-gray-200'
        }`}>
          <div className="flex items-center space-x-2 mb-6">
            <Mail className={`h-5 w-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Email Configuration
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Admin Email Address
              </label>
              <input
                type="email"
                value={emailSettings.address}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  address: e.target.value
                })}
                className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                SMTP Server
              </label>
              <input
                type="text"
                value={emailSettings.smtp}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  smtp: e.target.value
                })}
                className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                SMTP Port
              </label>
              <input
                type="text"
                value={emailSettings.port}
                onChange={(e) => setEmailSettings({
                  ...emailSettings,
                  port: e.target.value
                })}
                className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark'
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
            : 'bg-white/50 backdrop-blur-xl border border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            System Information
          </h3>
          
          <div className="space-y-3 text-sm">
            {[
              { label: 'Version', value: 'ServerOptimizer Pro v2.1.0' },
              { label: 'Node.js', value: 'v18.17.0' },
              { label: 'Platform', value: 'Unix/Linux' },
              { label: 'Uptime', value: '7 days, 14 hours, 23 minutes' },
              { label: 'Last Updated', value: 'January 15, 2025' }
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className={
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }>
                  {label}:
                </span>
                <span className={`font-mono ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
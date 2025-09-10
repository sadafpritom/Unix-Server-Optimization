import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Cpu, HardDrive, MemoryStick, Network, Settings as SettingsIcon, Zap, TrendingUp, Shield, Bell, FileText } from 'lucide-react';
import { mockDataGenerator, ServerData } from './utils/mockData';
import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';
import Logs from './components/Logs';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<ServerData | null>(null);
  const [connected, setConnected] = useState(true); // Always connected for demo
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Initialize with mock data
    setData(mockDataGenerator.generateRealisticMetrics());
    
    // Update data every 2 seconds to simulate real-time monitoring
    const interval = setInterval(() => {
      setData(mockDataGenerator.generateRealisticMetrics());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const unacknowledgedAlerts = data?.alerts?.filter(alert => !alert.acknowledged).length || 0;

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: unacknowledgedAlerts },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const renderContent = () => {
    if (!data) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {connected ? 'Loading server data...' : 'Connecting to server...'}
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} theme={theme} />;
      case 'alerts':
        return <Alerts alerts={data.alerts} theme={theme} />;
      case 'logs':
        return <Logs logs={data.logs} theme={theme} />;
      case 'settings':
        return <Settings theme={theme} />;
      default:
        return <Dashboard data={data} theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700'
          : 'bg-white/50 backdrop-blur-xl border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Shield className="h-8 w-8 text-blue-500" />
                  <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                    connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}></div>
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    ServerOptimizer Pro
                  </h1>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Advanced Unix Server Monitoring
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                connected 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                {connected ? 'Connected' : 'Disconnected'}
              </div>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`w-64 transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gray-800/30 backdrop-blur-xl border-r border-gray-700'
            : 'bg-white/30 backdrop-blur-xl border-r border-gray-200'
        }`}>
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-500 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
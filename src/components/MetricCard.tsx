import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  details: Array<{ label: string; value: string | number }>;
  theme: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  details,
  theme
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  const bgColorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    green: 'bg-green-100 dark:bg-green-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
    orange: 'bg-orange-100 dark:bg-orange-900/30'
  };

  const textColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      theme === 'dark'
        ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
        : 'bg-white/50 backdrop-blur-xl border border-gray-200'
    }`}>
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full transform translate-x-8 -translate-y-8`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColorClasses[color]}`}>
            <Icon className={`h-6 w-6 ${textColorClasses[color]}`} />
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}>
            <TrendIcon className="h-3 w-3" />
            <span>{change}</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className={`text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </h3>
          <p className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </p>
        </div>

        <div className="space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {detail.label}
              </span>
              <span className={`text-xs font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
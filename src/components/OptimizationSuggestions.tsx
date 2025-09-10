import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface Suggestion {
  type: string;
  priority: string;
  title: string;
  description: string;
  actions: string[];
}

interface OptimizationSuggestionsProps {
  theme: string;
}

const OptimizationSuggestions: React.FC<OptimizationSuggestionsProps> = ({ theme }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // Use mock data instead of API call
        const { mockDataGenerator } = await import('../utils/mockData');
        const data = mockDataGenerator.getOptimizationSuggestions();
        setSuggestions(data);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        // Fallback suggestions
        setSuggestions([
          {
            type: 'performance',
            priority: 'medium',
            title: 'Optimize System Performance',
            description: 'Your system is running well but can be improved',
            actions: ['Enable CPU scaling', 'Optimize memory allocation', 'Clean temporary files']
          },
          {
            type: 'security',
            priority: 'high',
            title: 'Security Recommendations',
            description: 'Consider these security improvements',
            actions: ['Update system packages', 'Review firewall rules', 'Enable fail2ban']
          }
        ]);
      }
      setLoading(false);
    };

    fetchSuggestions();
    const interval = setInterval(fetchSuggestions, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className={`rounded-2xl p-6 transition-colors ${
        theme === 'dark'
          ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
          : 'bg-white/50 backdrop-blur-xl border border-gray-200'
      }`}>
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className={`h-5 w-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Optimization Suggestions
          </h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className={`h-4 rounded ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          <div className={`h-4 rounded w-3/4 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 transition-colors ${
      theme === 'dark'
        ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700'
        : 'bg-white/50 backdrop-blur-xl border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className={`h-5 w-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Optimization Suggestions
          </h3>
        </div>
        <Zap className={`h-5 w-5 text-yellow-500 animate-pulse`} />
      </div>

      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="font-medium">System is optimally configured!</p>
            <p className="text-sm">No optimization suggestions at this time.</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div key={index} className={`p-4 rounded-xl transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700/30 hover:bg-gray-700/50'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {suggestion.title}
                </h4>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                  {getPriorityIcon(suggestion.priority)}
                  <span className="capitalize">{suggestion.priority}</span>
                </div>
              </div>
              
              <p className={`text-sm mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {suggestion.description}
              </p>

              <div className="space-y-1">
                {suggestion.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-center space-x-2 text-xs">
                    <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                    <span className={
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }>
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OptimizationSuggestions;
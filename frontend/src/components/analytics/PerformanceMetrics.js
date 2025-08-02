import React from 'react';
import {
  Activity,
  Target,
  AlertCircle,
  HardDrive
} from 'lucide-react';

const PerformanceMetrics = ({ performanceData }) => {
  const metrics = [
    {
      title: 'Response Time',
      value: performanceData.avgResponseTime,
      icon: Activity,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Uptime',
      value: performanceData.uptime,
      icon: Target,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Error Rate',
      value: performanceData.errorRate,
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Storage Used',
      value: performanceData.storageUsed,
      icon: HardDrive,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className={`p-3 ${metric.bgColor} rounded-lg inline-block mb-2`}>
              <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
            </div>
            <p className="text-sm font-medium text-gray-600">{metric.title}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Storage Progress Bar */}
      {performanceData.storagePercentage && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Storage Usage</span>
            <span className="text-sm text-gray-500">
              {performanceData.storageUsed} / {performanceData.storageLimit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${performanceData.storagePercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {performanceData.storagePercentage}% used
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics; 
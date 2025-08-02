import React from 'react';
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const AnalyticsOverview = ({ overviewData }) => {
  const getGrowthIcon = (growth) => {
    if (growth > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (growth < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const metrics = [
    {
      title: 'Total Documents',
      value: overviewData.totalDocuments,
      growth: overviewData.growthRate?.documents || 0,
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Users',
      value: overviewData.totalUsers,
      growth: overviewData.growthRate?.users || 0,
      icon: Users,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Signatures',
      value: overviewData.totalSignatures,
      growth: overviewData.growthRate?.signatures || 0,
      icon: CheckCircle,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Avg Processing Time',
      value: overviewData.avgProcessingTime,
      growth: overviewData.growthRate?.processingTime || 0,
      icon: Clock,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <div className="flex items-center space-x-1 mt-1">
                {getGrowthIcon(metric.growth)}
                <p className={`text-sm ${getGrowthColor(metric.growth)}`}>
                  {metric.growth > 0 ? '+' : ''}{metric.growth}% from last month
                </p>
              </div>
            </div>
            <div className={`p-3 ${metric.bgColor} rounded-lg`}>
              <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsOverview; 
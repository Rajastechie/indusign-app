import React from 'react';
import { FileText, Download, Award } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import AnalyticsOverview from '../components/analytics/AnalyticsOverview';
import ActivityChart from '../components/analytics/ActivityChart';
import DistributionChart from '../components/analytics/DistributionChart';
import UserActivity from '../components/analytics/UserActivity';
import PerformanceMetrics from '../components/analytics/PerformanceMetrics';

const AnalyticsModular = ({ onNavigate }) => {
  const {
    timeRange,
    selectedMetric,
    isLoading,
    analyticsData,
    metricData,
    setTimeRange,
    setSelectedMetric,
    refreshData
  } = useAnalytics();

  const getStatusColor = (item) => {
    switch (item.status) {
      case 'signed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'draft': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (item, index) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your document activity and business insights</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <AnalyticsOverview overviewData={analyticsData.overview} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Chart */}
        <ActivityChart
          data={metricData}
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
          title="Activity Trends"
        />

        {/* Document Status Distribution */}
        <DistributionChart
          data={analyticsData.documentStats.byStatus}
          title="Document Status Distribution"
          colorFunction={getStatusColor}
        />
      </div>

      {/* Document Types and User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Document Types */}
        <DistributionChart
          data={analyticsData.documentStats.byType}
          title="Document Types"
          colorFunction={getTypeColor}
        />

        {/* Top Users */}
        <UserActivity users={analyticsData.userActivity.topUsers} />
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics performanceData={analyticsData.performance} />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('docrepo')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">View Documents</span>
          </button>
          
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Upload Document</span>
          </button>
          
          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModular; 
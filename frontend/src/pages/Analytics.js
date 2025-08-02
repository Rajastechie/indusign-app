import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Activity,
  Calendar,
  PieChart,
  LineChart,
  Target,
  Award,
  HardDrive
} from 'lucide-react';

const Analytics = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y
  const [selectedMetric, setSelectedMetric] = useState('documents');

  // Mock analytics data - replace with real data from your backend
  const analyticsData = useMemo(() => ({
    overview: {
      totalDocuments: 1247,
      totalUsers: 89,
      totalSignatures: 3421,
      avgProcessingTime: '2.3 days'
    },
    documentStats: {
      byStatus: [
        { status: 'signed', count: 892, percentage: 71.5 },
        { status: 'pending', count: 234, percentage: 18.8 },
        { status: 'draft', count: 121, percentage: 9.7 }
      ],
      byType: [
        { type: 'Contracts', count: 456, percentage: 36.6 },
        { type: 'Invoices', count: 234, percentage: 18.8 },
        { type: 'Agreements', count: 198, percentage: 15.9 },
        { type: 'Proposals', count: 156, percentage: 12.5 },
        { type: 'NDAs', count: 89, percentage: 7.1 },
        { type: 'Others', count: 114, percentage: 9.1 }
      ]
    },
    activityData: {
      daily: [
        { date: '2024-01-01', documents: 12, signatures: 8, users: 5 },
        { date: '2024-01-02', documents: 15, signatures: 12, users: 7 },
        { date: '2024-01-03', documents: 18, signatures: 14, users: 9 },
        { date: '2024-01-04', documents: 22, signatures: 18, users: 11 },
        { date: '2024-01-05', documents: 25, signatures: 21, users: 13 },
        { date: '2024-01-06', documents: 28, signatures: 24, users: 15 },
        { date: '2024-01-07', documents: 32, signatures: 28, users: 17 }
      ],
      weekly: [
        { week: 'Week 1', documents: 85, signatures: 72, users: 23 },
        { week: 'Week 2', documents: 92, signatures: 78, users: 28 },
        { week: 'Week 3', documents: 104, signatures: 89, users: 31 },
        { week: 'Week 4', documents: 118, signatures: 102, users: 35 }
      ]
    },
    userActivity: {
      topUsers: [
        { name: 'John Doe', documents: 45, signatures: 38, lastActive: '2 hours ago' },
        { name: 'Jane Smith', documents: 38, signatures: 32, lastActive: '1 day ago' },
        { name: 'Mike Johnson', documents: 32, signatures: 28, lastActive: '3 hours ago' },
        { name: 'Sarah Wilson', documents: 28, signatures: 24, lastActive: '5 hours ago' },
        { name: 'David Brown', documents: 25, signatures: 21, lastActive: '1 day ago' }
      ],
      userGrowth: [
        { month: 'Jan', newUsers: 12, activeUsers: 45 },
        { month: 'Feb', newUsers: 18, activeUsers: 52 },
        { month: 'Mar', newUsers: 15, activeUsers: 58 },
        { month: 'Apr', newUsers: 22, activeUsers: 67 },
        { month: 'May', newUsers: 19, activeUsers: 72 },
        { month: 'Jun', newUsers: 25, activeUsers: 89 }
      ]
    },
    performance: {
      avgResponseTime: '1.2s',
      uptime: '99.8%',
      errorRate: '0.2%',
      storageUsed: '2.4 GB',
      storageLimit: '10 GB'
    }
  }), []);

  const getMetricData = () => {
    const data = timeRange === '7d' ? analyticsData.activityData.daily : analyticsData.activityData.weekly;
    return data.map(item => ({
      label: timeRange === '7d' ? item.date : item.week,
      value: selectedMetric === 'documents' ? item.documents : 
             selectedMetric === 'signatures' ? item.signatures : item.users
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'draft': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (index) => {
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
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalDocuments}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalUsers}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Signatures</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalSignatures}</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.overview.avgProcessingTime}</p>
              <p className="text-sm text-red-600">-5% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activity Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="documents">Documents</option>
              <option value="signatures">Signatures</option>
              <option value="users">Users</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {getMetricData().map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ 
                    height: `${(item.value / Math.max(...getMetricData().map(d => d.value))) * 200}px` 
                  }}
                ></div>
                <p className="text-xs text-gray-500 mt-2 text-center">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Document Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Status Distribution</h3>
          
          <div className="space-y-4">
            {analyticsData.documentStats.byStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(item.status)}`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{item.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStatusColor(item.status)}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Types and User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Document Types */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Types</h3>
          
          <div className="space-y-4">
            {analyticsData.documentStats.byType.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getTypeColor(index)}`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getTypeColor(index)}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Active Users</h3>
          
          <div className="space-y-4">
            {analyticsData.userActivity.topUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.lastActive}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.documents} docs</p>
                  <p className="text-xs text-gray-500">{user.signatures} signatures</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg inline-block mb-2">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Response Time</p>
            <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.avgResponseTime}</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-lg inline-block mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Uptime</p>
            <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.uptime}</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-lg inline-block mb-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Error Rate</p>
            <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.errorRate}</p>
          </div>
          
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-lg inline-block mb-2">
              <HardDrive className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Storage Used</p>
            <p className="text-2xl font-bold text-gray-900">{analyticsData.performance.storageUsed}</p>
          </div>
        </div>
      </div>

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

export default Analytics; 
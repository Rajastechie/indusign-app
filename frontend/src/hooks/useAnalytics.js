import { useState, useMemo, useEffect } from 'react';

export const useAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('documents');
  const [isLoading, setIsLoading] = useState(false);

  // Mock analytics data - replace with real API calls
  const analyticsData = useMemo(() => ({
    overview: {
      totalDocuments: 1247,
      totalUsers: 89,
      totalSignatures: 3421,
      avgProcessingTime: '2.3 days',
      growthRate: {
        documents: 12,
        users: 8,
        signatures: 15,
        processingTime: -5
      }
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
      ],
      monthly: [
        { month: 'Jan', documents: 456, signatures: 389, users: 67 },
        { month: 'Feb', documents: 523, signatures: 445, users: 72 },
        { month: 'Mar', documents: 489, signatures: 412, users: 68 },
        { month: 'Apr', documents: 567, signatures: 478, users: 75 },
        { month: 'May', documents: 612, signatures: 523, users: 81 },
        { month: 'Jun', documents: 678, signatures: 589, users: 89 }
      ]
    },
    userActivity: {
      topUsers: [
        { name: 'John Doe', documents: 45, signatures: 38, lastActive: '2 hours ago', avatar: 'JD' },
        { name: 'Jane Smith', documents: 38, signatures: 32, lastActive: '1 day ago', avatar: 'JS' },
        { name: 'Mike Johnson', documents: 32, signatures: 28, lastActive: '3 hours ago', avatar: 'MJ' },
        { name: 'Sarah Wilson', documents: 28, signatures: 24, lastActive: '5 hours ago', avatar: 'SW' },
        { name: 'David Brown', documents: 25, signatures: 21, lastActive: '1 day ago', avatar: 'DB' }
      ],
      userGrowth: [
        { month: 'Jan', newUsers: 12, activeUsers: 45, retention: 85 },
        { month: 'Feb', newUsers: 18, activeUsers: 52, retention: 87 },
        { month: 'Mar', newUsers: 15, activeUsers: 58, retention: 89 },
        { month: 'Apr', newUsers: 22, activeUsers: 67, retention: 91 },
        { month: 'May', newUsers: 19, activeUsers: 72, retention: 93 },
        { month: 'Jun', newUsers: 25, activeUsers: 89, retention: 95 }
      ]
    },
    performance: {
      avgResponseTime: '1.2s',
      uptime: '99.8%',
      errorRate: '0.2%',
      storageUsed: '2.4 GB',
      storageLimit: '10 GB',
      storagePercentage: 24
    },
    insights: {
      topPerformingUsers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      mostActiveHours: ['9:00 AM', '2:00 PM', '4:00 PM'],
      peakUsageDays: ['Tuesday', 'Wednesday', 'Thursday'],
      documentCompletionRate: 78.5,
      averageSigningTime: '3.2 hours'
    }
  }), []);

  // Get activity data based on time range
  const getActivityData = () => {
    switch (timeRange) {
      case '7d':
        return analyticsData.activityData.daily;
      case '30d':
        return analyticsData.activityData.weekly;
      case '90d':
      case '1y':
        return analyticsData.activityData.monthly;
      default:
        return analyticsData.activityData.weekly;
    }
  };

  // Get metric data for charts
  const getMetricData = () => {
    const data = getActivityData();
    return data.map(item => ({
      label: timeRange === '7d' ? item.date : 
             timeRange === '30d' ? item.week : item.month,
      value: selectedMetric === 'documents' ? item.documents : 
             selectedMetric === 'signatures' ? item.signatures : item.users
    }));
  };

  // Calculate growth rate
  const getGrowthRate = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  // Get insights
  const getInsights = () => {
    const insights = [];
    
    // Document completion rate insight
    if (analyticsData.insights.documentCompletionRate > 75) {
      insights.push({
        type: 'positive',
        message: `High document completion rate of ${analyticsData.insights.documentCompletionRate}%`,
        icon: 'CheckCircle'
      });
    }
    
    // User growth insight
    const userGrowth = getGrowthRate(analyticsData.overview.totalUsers, 82);
    if (userGrowth > 5) {
      insights.push({
        type: 'positive',
        message: `User base growing by ${userGrowth.toFixed(1)}%`,
        icon: 'TrendingUp'
      });
    }
    
    // Performance insight
    if (analyticsData.performance.uptime === '99.8%') {
      insights.push({
        type: 'positive',
        message: 'Excellent system uptime maintained',
        icon: 'Target'
      });
    }
    
    return insights;
  };

  // Refresh analytics data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, fetch fresh data from API
    } catch (error) {
      console.error('Error refreshing analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(refreshData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    // State
    timeRange,
    selectedMetric,
    isLoading,
    
    // Data
    analyticsData,
    activityData: getActivityData(),
    metricData: getMetricData(),
    insights: getInsights(),
    
    // Actions
    setTimeRange,
    setSelectedMetric,
    refreshData
  };
}; 
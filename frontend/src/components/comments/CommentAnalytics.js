import React from 'react';
import {
  MessageSquare,
  Users,
  ThumbsUp,
  TrendingUp,
  Clock,
  User,
  Activity,
  BarChart3,
  Calendar,
  Award
} from 'lucide-react';

const CommentAnalytics = ({ commentStats, recentActivity, currentUser }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const getActivityTypeIcon = (type) => {
    switch (type) {
      case 'comment': return MessageSquare;
      case 'reply': return Users;
      default: return Activity;
    }
  };

  const getActivityTypeColor = (type) => {
    switch (type) {
      case 'comment': return 'text-blue-600 bg-blue-100';
      case 'reply': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const engagementRate = commentStats.totalComments > 0 
    ? ((commentStats.totalLikes + commentStats.totalReplies) / commentStats.totalComments).toFixed(1)
    : 0;

  const metrics = [
    {
      title: 'Total Comments',
      value: commentStats.totalComments,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-100',
      description: 'Comments on this document'
    },
    {
      title: 'Total Replies',
      value: commentStats.totalReplies,
      icon: Users,
      color: 'text-green-600 bg-green-100',
      description: 'Replies to comments'
    },
    {
      title: 'Total Likes',
      value: commentStats.totalLikes,
      icon: ThumbsUp,
      color: 'text-purple-600 bg-purple-100',
      description: 'Likes on comments'
    },
    {
      title: 'Engagement Rate',
      value: `${engagementRate}x`,
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-100',
      description: 'Avg engagement per comment'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Comment Analytics</h3>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {formatTimestamp(new Date().toISOString())}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Contributor */}
      {commentStats.topContributor && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Top Contributor</h4>
            <Award className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">User #{commentStats.topContributor.userId}</p>
              <p className="text-sm text-gray-600">{commentStats.topContributor.count} comments</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Recent Activity</h4>
        </div>
        <div className="p-4">
          {recentActivity.length === 0 ? (
            <div className="text-center py-4">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, index) => {
                const Icon = getActivityTypeIcon(activity.type);
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getActivityTypeColor(activity.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">
                        <span className="font-medium">{activity.author.name}</span>
                        {activity.type === 'comment' ? ' commented' : ' replied'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                    {activity.likes && activity.likes.length > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{activity.likes.length}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Engagement Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Engagement Insights</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average likes per comment</span>
            <span className="text-sm font-medium text-gray-900">{commentStats.averageLikes}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Reply rate</span>
            <span className="text-sm font-medium text-gray-900">
              {commentStats.totalComments > 0 
                ? `${((commentStats.totalReplies / commentStats.totalComments) * 100).toFixed(1)}%`
                : '0%'
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Most active time</span>
            <span className="text-sm font-medium text-gray-900">Morning (9-11 AM)</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>Add Comment</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Users className="w-4 h-4" />
            <span>Mention Users</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentAnalytics; 
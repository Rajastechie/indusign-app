import React, { useState } from 'react';
import {
  MessageSquare,
  BarChart3,
  Settings,
  Search,
  Filter,
  SortAsc,
  User,
  Clock,
  ThumbsUp,
  Reply,
  Edit3,
  Trash2,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import CommentSection from '../components/comments/CommentSection';
import CommentAnalytics from '../components/comments/CommentAnalytics';
import { useComments } from '../hooks/useComments';

const DocumentComments = ({ document, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('comments');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock current user
  const currentUser = { id: 1, name: 'Current User', avatar: null };

  // Use the comments hook
  const {
    comments,
    isLoading,
    error,
    addComment,
    editComment,
    deleteComment,
    replyToComment,
    likeComment,
    commentStats,
    recentActivity,
    searchComments
  } = useComments(document?.id);

  const filteredComments = searchComments(searchTerm);

  const tabs = [
    { id: 'comments', label: 'Comments', icon: MessageSquare, count: comments.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'replies', label: 'Most Replies' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Comments' },
    { value: 'my', label: 'My Comments' },
    { value: 'mentions', label: 'Mentions' },
    { value: 'replies', label: 'Replies Only' }
  ];

  const handleSort = (value) => {
    setSortBy(value);
    // In real implementation, sort comments based on value
  };

  const handleFilter = (value) => {
    setFilterBy(value);
    // In real implementation, filter comments based on value
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comments':
        return (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search comments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Filters"
                >
                  <Filter className="w-4 h-4" />
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {showFilters && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Filter by:</span>
                    {filterOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleFilter(option.value)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          filterBy === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <CommentSection
              documentId={document?.id}
              comments={filteredComments}
              onAddComment={addComment}
              onEditComment={editComment}
              onDeleteComment={deleteComment}
              onReplyToComment={replyToComment}
              onLikeComment={likeComment}
              currentUser={currentUser}
            />
          </div>
        );

      case 'analytics':
        return (
          <CommentAnalytics
            commentStats={commentStats}
            recentActivity={recentActivity}
            currentUser={currentUser}
          />
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive email notifications for new comments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Mention Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified when someone mentions you</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Auto-save Drafts</h4>
                    <p className="text-sm text-gray-600">Automatically save comment drafts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who can comment on this document?
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="team">Team members only</option>
                    <option value="anyone">Anyone with access</option>
                    <option value="specific">Specific users</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment moderation
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="none">No moderation</option>
                    <option value="approval">Require approval</option>
                    <option value="filter">Filter inappropriate content</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('docrepo')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Comments - {document?.name || 'Document'}
            </h1>
            <p className="text-sm text-gray-600">
              {commentStats.totalComments} comments • {commentStats.totalReplies} replies
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Loading comments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Tab Content */}
      {!isLoading && !error && renderTabContent()}
    </div>
  );
};

export default DocumentComments; 
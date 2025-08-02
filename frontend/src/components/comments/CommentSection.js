import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Edit3,
  Trash2,
  MoreVertical,
  User,
  Clock,
  Reply,
  ThumbsUp,
  Flag,
  Smile,
  Paperclip,
  AtSign
} from 'lucide-react';

const CommentSection = ({ 
  documentId, 
  comments = [], 
  onAddComment, 
  onEditComment, 
  onDeleteComment, 
  onReplyToComment,
  onLikeComment,
  currentUser = { id: 1, name: 'Current User', avatar: null }
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const textareaRef = useRef(null);

  // Mock users for mentions
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com' }
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment({
        id: Date.now(),
        text: newComment,
        author: currentUser,
        timestamp: new Date().toISOString(),
        likes: [],
        replies: [],
        mentions: extractMentions(newComment)
      });
      setNewComment('');
      setShowEmojiPicker(false);
    }
  };

  const handleEditComment = (commentId) => {
    if (editText.trim()) {
      onEditComment(commentId, editText);
      setEditingComment(null);
      setEditText('');
    }
  };

  const handleReplySubmit = (parentCommentId) => {
    if (replyText.trim()) {
      onReplyToComment(parentCommentId, {
        id: Date.now(),
        text: replyText,
        author: currentUser,
        timestamp: new Date().toISOString(),
        likes: [],
        mentions: extractMentions(replyText)
      });
      setReplyTo(null);
      setReplyText('');
    }
  };

  const handleLikeComment = (commentId) => {
    onLikeComment(commentId, currentUser.id);
  };

  const extractMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      const user = users.find(u => 
        u.name.toLowerCase().includes(match[1].toLowerCase()) ||
        u.email.toLowerCase().includes(match[1].toLowerCase())
      );
      if (user) mentions.push(user);
    }
    return mentions;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const renderComment = (comment, isReply = false) => {
    const isAuthor = comment.author.id === currentUser.id;
    const isLiked = comment.likes.includes(currentUser.id);
    const hasReplies = comment.replies && comment.replies.length > 0;

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                  {comment.mentions.length > 0 && (
                    <span className="text-xs text-blue-600">
                      @{comment.mentions.map(m => m.name).join(', ')}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {isAuthor && (
                    <>
                      <button
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditText(comment.text);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              {editingComment === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingComment(null);
                        setEditText('');
                      }}
                      className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {comment.text}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center space-x-1 text-xs ${
                        isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{comment.likes.length}</span>
                    </button>
                    
                    {!isReply && (
                      <button
                        onClick={() => setReplyTo(comment.id)}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <Reply className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                    )}
                    
                    <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700">
                      <Flag className="w-3 h-3" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Reply Input */}
            {replyTo === comment.id && (
              <div className="mt-3 ml-8">
                <div className="flex space-x-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText('');
                      }}
                      className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Replies */}
            {hasReplies && (
              <div className="mt-3">
                <button
                  onClick={() => setShowReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {showReplies[comment.id] ? 'Hide replies' : `Show ${comment.replies.length} replies`}
                </button>
                
                {showReplies[comment.id] && (
                  <div className="mt-2">
                    {comment.replies.map(reply => renderComment(reply, true))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          <span className="text-sm text-gray-500">({comments.length})</span>
        </div>
      </div>

      {/* Comments List */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => renderComment(comment))}
          </div>
        )}
      </div>

      {/* Add Comment */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  if (e.target.value.includes('@')) {
                    setShowMentionDropdown(true);
                    setMentionSearch(e.target.value.split('@').pop() || '');
                  } else {
                    setShowMentionDropdown(false);
                  }
                }}
                placeholder="Add a comment... Use @ to mention someone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              
              {/* Mention Dropdown */}
              {showMentionDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        const beforeMention = newComment.substring(0, newComment.lastIndexOf('@'));
                        setNewComment(`${beforeMention}@${user.name} `);
                        setShowMentionDropdown(false);
                        textareaRef.current?.focus();
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{user.name}</span>
                      <span className="text-gray-500 text-xs">({user.email})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Add emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600" title="Attach file">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600" title="Mention">
                  <AtSign className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection; 
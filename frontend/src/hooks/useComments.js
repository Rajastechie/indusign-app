import { useState, useCallback, useMemo } from 'react';

export const useComments = (documentId) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock initial comments for demonstration
  const mockComments = [
    {
      id: 1,
      text: "This contract looks good overall. Please review the terms in section 3.2.",
      author: { id: 1, name: 'John Doe', avatar: null },
      timestamp: '2024-01-15T10:30:00Z',
      likes: [2, 3],
      replies: [
        {
          id: 11,
          text: "I've reviewed section 3.2 and it looks fine to me.",
          author: { id: 2, name: 'Jane Smith', avatar: null },
          timestamp: '2024-01-15T11:15:00Z',
          likes: [1],
          mentions: []
        }
      ],
      mentions: []
    },
    {
      id: 2,
      text: "@Jane Smith Can you please check the payment terms? They seem unclear.",
      author: { id: 3, name: 'Mike Johnson', avatar: null },
      timestamp: '2024-01-15T09:45:00Z',
      likes: [1],
      replies: [],
      mentions: [{ id: 2, name: 'Jane Smith', email: 'jane@example.com' }]
    },
    {
      id: 3,
      text: "The document has been updated with the latest changes. Please review.",
      author: { id: 4, name: 'Sarah Wilson', avatar: null },
      timestamp: '2024-01-15T08:20:00Z',
      likes: [1, 2, 3],
      replies: [],
      mentions: []
    }
  ];

  // Initialize with mock data
  useState(() => {
    setComments(mockComments);
  });

  // Add a new comment
  const addComment = useCallback(async (comment) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComment = {
        ...comment,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      
      setComments(prev => [newComment, ...prev]);
      
      // In real implementation, make API call to save comment
      console.log('Adding comment:', newComment);
      
      return newComment;
    } catch (err) {
      setError('Failed to add comment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Edit an existing comment
  const editComment = useCallback(async (commentId, newText) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, text: newText, editedAt: new Date().toISOString() }
          : comment
      ));
      
      // In real implementation, make API call to update comment
      console.log('Editing comment:', commentId, newText);
      
    } catch (err) {
      setError('Failed to edit comment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a comment
  const deleteComment = useCallback(async (commentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
      // In real implementation, make API call to delete comment
      console.log('Deleting comment:', commentId);
      
    } catch (err) {
      setError('Failed to delete comment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reply to a comment
  const replyToComment = useCallback(async (parentCommentId, reply) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newReply = {
        ...reply,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      
      setComments(prev => prev.map(comment => 
        comment.id === parentCommentId 
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      ));
      
      // In real implementation, make API call to save reply
      console.log('Adding reply to comment:', parentCommentId, newReply);
      
      return newReply;
    } catch (err) {
      setError('Failed to add reply');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Like/unlike a comment
  const likeComment = useCallback(async (commentId, userId) => {
    try {
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          const isLiked = comment.likes.includes(userId);
          return {
            ...comment,
            likes: isLiked 
              ? comment.likes.filter(id => id !== userId)
              : [...comment.likes, userId]
          };
        }
        return comment;
      }));
      
      // In real implementation, make API call to update likes
      console.log('Toggling like for comment:', commentId, userId);
      
    } catch (err) {
      setError('Failed to update like');
      throw err;
    }
  }, []);

  // Get comment statistics
  const commentStats = useMemo(() => {
    const totalComments = comments.length;
    const totalReplies = comments.reduce((sum, comment) => sum + (comment.replies?.length || 0), 0);
    const totalLikes = comments.reduce((sum, comment) => sum + comment.likes.length, 0);
    const mostActiveUser = comments.reduce((acc, comment) => {
      const authorId = comment.author.id;
      acc[authorId] = (acc[authorId] || 0) + 1;
      return acc;
    }, {});
    
    const topContributor = Object.entries(mostActiveUser)
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      totalComments,
      totalReplies,
      totalLikes,
      topContributor: topContributor ? {
        userId: parseInt(topContributor[0]),
        count: topContributor[1]
      } : null,
      averageLikes: totalComments > 0 ? (totalLikes / totalComments).toFixed(1) : 0
    };
  }, [comments]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    const allComments = [
      ...comments.map(comment => ({ ...comment, type: 'comment' })),
      ...comments.flatMap(comment => 
        (comment.replies || []).map(reply => ({ ...reply, type: 'reply', parentId: comment.id }))
      )
    ];
    
    return allComments
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }, [comments]);

  // Search comments
  const searchComments = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return comments;
    
    const term = searchTerm.toLowerCase();
    return comments.filter(comment => 
      comment.text.toLowerCase().includes(term) ||
      comment.author.name.toLowerCase().includes(term) ||
      comment.replies?.some(reply => 
        reply.text.toLowerCase().includes(term) ||
        reply.author.name.toLowerCase().includes(term)
      )
    );
  }, [comments]);

  // Get comments by user
  const getCommentsByUser = useCallback((userId) => {
    return comments.filter(comment => comment.author.id === userId);
  }, [comments]);

  // Get mentions for a user
  const getMentionsForUser = useCallback((userId) => {
    return comments.filter(comment => 
      comment.mentions?.some(mention => mention.id === userId) ||
      comment.replies?.some(reply => 
        reply.mentions?.some(mention => mention.id === userId)
      )
    );
  }, [comments]);

  return {
    // State
    comments,
    isLoading,
    error,
    
    // Actions
    addComment,
    editComment,
    deleteComment,
    replyToComment,
    likeComment,
    
    // Queries
    commentStats,
    recentActivity,
    searchComments,
    getCommentsByUser,
    getMentionsForUser
  };
}; 
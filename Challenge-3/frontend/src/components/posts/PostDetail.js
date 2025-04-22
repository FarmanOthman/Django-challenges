import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    try {
      const response = await api.get(`/posts/${id}/`);
      setPost(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/posts/${id}/comments/`, {
        content: comment
      });
      setPost({
        ...post,
        comments: [...post.comments, response.data]
      });
      setComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-detail">
      <div className="post-content">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>By {post.author_username}</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <p className="post-text">{post.content}</p>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>
        {user && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit">Post Comment</button>
          </form>
        )}

        <div className="comments-list">
          {post.comments?.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-meta">
                <span>{comment.author_username}</span>
                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
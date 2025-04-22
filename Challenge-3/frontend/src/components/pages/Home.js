import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import CreatePost from '../posts/CreatePost';
import './Home.css';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/');
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <header className="header">
        <h1>Blog Posts</h1>
        <div className="user-info">
          {user && (
            <>
              <span>Welcome, {user.username}!</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </header>

      <div className="content-wrapper">
        <aside className="sidebar">
          <div className="user-section">
            {user && (
              <div>
                <h3>My Profile</h3>
                <p>{user.email}</p>
              </div>
            )}
          </div>
        </aside>

        <main className="main-content">
          {user && (
            <button 
              className="create-post-btn"
              onClick={() => setShowCreatePost(true)}
            >
              Create New Post
            </button>
          )}

          <div className="posts-grid">
            {posts.map(post => (
              <div 
                key={post.id} 
                className="post-card"
                onClick={() => handlePostClick(post.id)}
                style={{ cursor: 'pointer' }}
              >
                <h2>{post.title}</h2>
                <p>{post.content.substring(0, 150)}...</p>
                <div className="post-meta">
                  <span>By {post.author_username}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showCreatePost && (
        <CreatePost
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default Home;
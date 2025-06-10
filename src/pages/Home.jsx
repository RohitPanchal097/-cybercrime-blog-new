import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faArrowRight, faNewspaper, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { postsAPI } from '../services/api';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getAllPosts();
        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}/uploads/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p className="mt-3">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {posts.map((post) => (
          <div key={post._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              {post.image ? (
                <img 
                  src={getImageUrl(post.image)}
                  className="card-img-top" 
                  alt={post.title || 'Blog post image'}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              ) : (
                <div 
                  className="card-img-top d-flex align-items-center justify-content-center bg-light"
                  style={{ height: '200px' }}
                >
                  <FontAwesomeIcon icon={faNewspaper} size="3x" className="text-muted" />
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text text-muted">
                  <small>
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    {formatDate(post.createdAt)}
                  </small>
                  <br />
                  <small>
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    {post.author || 'Anonymous'}
                  </small>
                </p>
                <p className="card-text">
                  {post.content?.substring(0, 150)}
                  {post.content?.length > 150 ? '...' : ''}
                </p>
                <Link to={`/post/${post._id}`} className="btn btn-primary">
                  Read More <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 
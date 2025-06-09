import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faArrowRight, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { postsAPI } from '../services/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postsAPI.getAllPosts();
        // Ensure we have an array and filter out any invalid posts
        const validPosts = Array.isArray(data) 
          ? data.filter(post => post && typeof post === 'object')
          : [];
        setPosts(validPosts);
      } catch (error) {
        setError('Failed to fetch posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-link" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section bg-dark text-white py-5 mb-5 rounded">
        <div className="container">
          <h1 className="display-4">Stay Safe in the Digital World</h1>
          <p className="lead">Learn about cyber threats and how to protect yourself</p>
        </div>
      </div>

      <div className="container">
        <h2 className="mb-4">Latest Articles</h2>
        {posts.length > 0 ? (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post._id || Math.random()} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  {post.image ? (
                    <img 
                      src={`http://localhost:5000/uploads/${post.image}`}
                      className="card-img-top" 
                      alt={post.title || 'Blog post image'}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="card-img-top bg-light d-flex align-items-center justify-content-center"
                      style={{ height: '200px' }}
                    >
                      <FontAwesomeIcon icon={faNewspaper} className="fa-3x text-muted" />
                    </div>
                  )}
                  <div className="card-body">
                    {post.category && (
                      <span className="badge bg-primary mb-2">{post.category}</span>
                    )}
                    <h5 className="card-title">{post.title || 'Untitled Post'}</h5>
                    <p className="card-text">
                      {post.content 
                        ? (post.content.length > 150 
                            ? `${post.content.substring(0, 150)}...` 
                            : post.content)
                        : 'No content available.'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted small">
                        {post.createdAt && (
                          <>
                            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </>
                        )}
                        {post.author?.username && (
                          <>
                            <FontAwesomeIcon icon={faUser} className="ms-2 me-1" />
                            {post.author.username}
                          </>
                        )}
                      </div>
                      {post._id && (
                        <Link to={`/post/${post._id}`} className="btn btn-outline-primary btn-sm">
                          Read More <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="card shadow-sm">
              <div className="card-body py-5">
                <FontAwesomeIcon icon={faNewspaper} className="fa-3x text-muted mb-3" />
                <h3 className="h4 text-muted mb-3">No Posts Available</h3>
                <p className="text-muted mb-0">
                  Our admin team is working on creating informative content about cyber security.
                  <br />
                  Please check back soon for new articles!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 
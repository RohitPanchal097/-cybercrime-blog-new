import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faArrowRight, faNewspaper, faSpinner, faShieldHalved, faHandshakeSimple, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { postsAPI } from '../services/back4app';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const posts = await postsAPI.getAllPosts();
        setPosts(posts);
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
    <>
      {/* Hero Section */}
      <section className="hero-section text-center py-5 animate__animated animate__fadeIn">
        <div className="container">
          <h1 className="display-4 mb-4 animate__animated animate__fadeInDown">Safeguarding Your Digital World</h1>
          <p className="lead mb-5 animate__animated animate__fadeInUp animate__delay-1s">
            Stay informed about the latest cyber threats, learn essential security tips,
            and protect yourself from online crime.
          </p>
          <Link to="/categories" className="btn btn-lg btn-primary animate__animated animate__zoomIn animate__delay-2s">
            Explore Categories <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          </Link>
        </div>
      </section>

      {/* Features/About Section */}
      <section className="py-5 feature-section">
        <div className="container">
          <h2 className="text-center mb-5 animate__animated animate__fadeInUp">Why CyberCrime Blog?</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="card h-100 p-4 animate__animated animate__fadeInUp animate__delay-1s">
                <FontAwesomeIcon icon={faShieldHalved} className="fa-3x text-primary mb-3" />
                <h3 className="h5">Expert Insights</h3>
                <p>Dive deep into cybersecurity topics with articles written by industry professionals.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 p-4 animate__animated animate__fadeInUp animate__delay-1-5s">
                <FontAwesomeIcon icon={faLightbulb} className="fa-3x text-primary mb-3" />
                <h3 className="h5">Practical Tips</h3>
                <p>Get actionable advice and step-by-step guides to enhance your online security.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 p-4 animate__animated animate__fadeInUp animate__delay-2s">
                <FontAwesomeIcon icon={faHandshakeSimple} className="fa-3x text-primary mb-3" />
                <h3 className="h5">Community Focused</h3>
                <p>Join a growing community dedicated to digital safety and awareness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section (Existing content) */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4 text-center animate__animated animate__fadeInUp">Latest Blog Posts</h2>
          <div className="row">
            {posts.map((post) => (
              <div key={post.id} className="col-md-4 mb-4 animate__animated animate__fadeInUp">
                <div className="card h-100 shadow-sm">
                  {post.image ? (
                    <img 
                      src={post.image}
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
                      style={{ height: '200px', width: '100%' }}
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
                    <Link to={`/post/${post.id}`} className="btn btn-primary">
                      Read More <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5 text-center animate__animated animate__fadeInUp">
        <div className="container">
          <h2 className="text-white mb-4 animate__animated animate__fadeInDown">Ready to Enhance Your Security?</h2>
          <p className="lead text-white-75 mb-5 animate__animated animate__fadeInUp animate__delay-1s">
            Join our community and get the latest updates directly in your inbox.
          </p>
          <Link to="/admin/login" className="btn btn-lg btn-light animate__animated animate__zoomIn animate__delay-2s">
            Become a Member <FontAwesomeIcon icon={faUser} className="ms-2" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home; 
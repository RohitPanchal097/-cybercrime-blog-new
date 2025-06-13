import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faArrowRight, faFolder } from '@fortawesome/free-solid-svg-icons';
import { postsAPI } from '../services/back4app';

const Categories = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const posts = await postsAPI.getAllPosts();
        
        // Group posts by category and filter out invalid posts
        const groupedPosts = (Array.isArray(posts) ? posts : [])
          .filter(post => post && typeof post === 'object')
          .reduce((acc, post) => {
            const category = post.category || 'Uncategorized';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(post);
            return acc;
          }, {});

        setCategories(groupedPosts);
      } catch (error) {
        setError('Failed to fetch posts');
        setCategories({});
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

  const categoryList = Object.keys(categories).sort();

  if (categoryList.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="card shadow-sm">
          <div className="card-body py-5">
            <FontAwesomeIcon icon={faFolder} className="fa-3x text-muted mb-3" />
            <h3 className="h4 text-muted mb-3">No Categories Available</h3>
            <p className="text-muted mb-0">
              Our admin team is working on creating informative content.
              <br />
              Please check back soon for categorized articles!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="container">
        <h2 className="mb-4">Browse by Category</h2>
        {categoryList.map(category => (
          <div key={category} className="category-section mb-5">
            <h3 className="h4 mb-4">
              <FontAwesomeIcon icon={faFolder} className="text-primary me-2" />
              {category}
              <span className="badge bg-secondary ms-2">{categories[category].length}</span>
            </h3>
            <div className="row g-4">
              {categories[category].map(post => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    {post.image ? (
                      <img 
                        src={post.image}
                        className="card-img-top" 
                        alt={post.title || 'Blog post image'}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="card-img-top bg-light d-flex align-items-center justify-content-center"
                        style={{ height: '200px' }}
                      >
                        <FontAwesomeIcon icon={faFolder} className="fa-3x text-muted" />
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
                        {post.id && (
                          <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
                            Read More <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories; 
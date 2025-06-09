import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faArrowLeft, faShare } from '@fortawesome/free-solid-svg-icons';
import { postsAPI } from '../services/api';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Post ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await postsAPI.getPost(id);
        if (!data) {
          throw new Error('Post not found');
        }
        setPost(data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch post');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Post not found'}
          <div className="mt-3">
            <Link to="/" className="btn btn-primary">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="blog-post">
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-primary">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Home
        </Link>
      </div>

      <div className="card shadow-sm">
        {post.image && (
          <img 
            src={`http://localhost:5000/uploads/${post.image}`} 
            className="card-img-top" 
            alt={post.title || 'Blog post image'}
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        )}
        <div className="card-body">
          <div className="mb-3">
            {post.category && (
              <span className="badge bg-primary">{post.category}</span>
            )}
          </div>
          
          <h1 className="card-title h2 mb-3">{post.title || 'Untitled Post'}</h1>
          
          <div className="text-muted mb-4">
            {post.createdAt && (
              <>
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                {new Date(post.createdAt).toLocaleDateString()}
              </>
            )}
            {post.author?.username && (
              <>
                <FontAwesomeIcon icon={faUser} className="ms-3 me-2" />
                {post.author.username}
              </>
            )}
          </div>

          <div className="blog-content">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-muted">No content available.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-top">
            <button 
              className="btn btn-outline-primary"
              onClick={() => {
                navigator.share({
                  title: post.title,
                  text: post.content?.substring(0, 100) + '...',
                  url: window.location.href
                }).catch(() => {
                  // Fallback for browsers that don't support Web Share API
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                });
              }}
            >
              <FontAwesomeIcon icon={faShare} className="me-2" />
              Share Post
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost; 
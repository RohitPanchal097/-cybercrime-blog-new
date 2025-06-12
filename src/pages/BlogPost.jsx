import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faArrowLeft, faShare, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { postsAPI } from '../services/api';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getPostById(id);
        setPost(response);
        setError(null);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to share post
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.content?.substring(0, 100) + '...',
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p className="mt-3">Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <div className="mt-3">
            <Link to="/" className="btn btn-outline-danger">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Post not found
          <div className="mt-3">
            <Link to="/" className="btn btn-outline-warning">
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Link to="/" className="btn btn-outline-primary mb-4">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Posts
          </Link>

          <article className="blog-post">
            <h1 className="mb-4">{post.title}</h1>
            
            <div className="text-muted mb-4">
              <small>
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                {formatDate(post.createdAt)}
              </small>
              <br />
              <small>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                {post.author || 'Anonymous'}
              </small>
            </div>

            {post.image && (
              <img
                src={post.image}
                className="img-fluid rounded mb-4"
                alt={post.title}
                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                }}
              />
            )}

            <div className="blog-content mb-4">
              {post.content?.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <button 
              onClick={handleShare}
              className="btn btn-outline-primary"
            >
              <FontAwesomeIcon icon={faShare} className="me-2" />
              Share Post
            </button>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPost; 
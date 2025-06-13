import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { postsAPI } from '../services/back4app';
import Parse from '../config/parse'; // Import Parse SDK

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // New state for auth check

  useEffect(() => {
    const checkAuthAndFetchPosts = async () => {
      const currentUser = Parse.User.current();
      if (!currentUser || !currentUser.getSessionToken()) {
        // Not authenticated, redirect to login
        navigate('/admin/login');
        return;
      }
      // Authenticated, proceed to fetch posts
      fetchPosts();
      setAuthChecked(true);
    };

    checkAuthAndFetchPosts();
  }, [navigate]); // Depend on navigate

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsAPI.getAllPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to fetch posts');
      toast.error('Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(id);
        toast.success('Post deleted successfully');
        fetchPosts(); // Refresh the posts list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete post');
      }
    }
  };

  // Render loading state until authentication check is complete
  if (!authChecked || loading) {
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
            onClick={fetchPosts}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Blog Posts</h2>
        <Link to="/admin/create" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Create New Post
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post?.id || Math.random()}>
                      <td>{post?.title || 'Untitled'}</td>
                      <td>
                        <span className="badge bg-primary">
                          {post?.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td>
                        {post?.createdAt 
                          ? new Date(post.createdAt).toLocaleDateString()
                          : 'N/A'
                        }
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link
                            to={`/admin/edit/${post?.id}`}
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post?.id)}
                            className="btn btn-sm btn-outline-danger ms-2"
                            title="Delete"
                            disabled={!post?.id}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No posts found. Create your first post!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { postsAPI } from '../services/back4app';

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: null,
    imagePreview: null
  });

  const categories = [
    'Phishing',
    'Ransomware',
    'Malware',
    'Social Engineering',
    'Data Breaches',
    'Identity Theft',
    'Password Security',
    'Network Security'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postsAPI.createPost(formData);
      toast.success('Post created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Create New Post</h2>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="btn btn-outline-secondary"
        >
          Cancel
        </button>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-select"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea
                className="form-control"
                id="content"
                name="content"
                rows="10"
                value={formData.content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="form-label">Featured Image</label>
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {formData.imagePreview && (
                <div className="mt-2">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Create Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 
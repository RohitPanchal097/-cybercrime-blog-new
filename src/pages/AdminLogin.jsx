import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Parse from '../config/parse';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Attempting login for user:", formData.username);
    try {
      const user = await Parse.User.logIn(formData.username, formData.password);
      
      console.log("Login successful. User object:", user);
      console.log("Session Token from Parse:", user.getSessionToken());

      localStorage.setItem('adminToken', user.getSessionToken());
      console.log("adminToken set in localStorage.", localStorage.getItem('adminToken'));

      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      let errorMessage = 'Invalid username or password';
      if (error.code === 101) {
        errorMessage = 'Invalid username or password';
      } else {
        console.error('Login error:', error);
        errorMessage = `Login failed: ${error.message}`;
      }
      toast.error(errorMessage);
      console.error("Login attempt failed. Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AdminLogin useEffect triggered. Current path:", location.pathname);
    if (location.pathname === '/admin/login') {
      const checkAdminSession = async () => {
        const currentUser = Parse.User.current();
        console.log("AdminLogin useEffect - currentUser:", currentUser);
        if (currentUser && currentUser.getSessionToken()) {
          console.log("AdminLogin useEffect - User already logged in, redirecting to dashboard.", currentUser.getSessionToken());
          navigate('/admin/dashboard');
        } else {
          console.log("AdminLogin useEffect - No Parse current user.");
          if (localStorage.getItem('adminToken')) {
            console.log("AdminLogin useEffect - Found stale adminToken in localStorage, clearing it.");
            localStorage.removeItem('adminToken');
          }
        }
      };
      checkAdminSession();
    }
  }, [location.pathname, navigate]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <FontAwesomeIcon icon={faUserLock} className="fa-3x text-primary mb-3" />
                <h2 className="h4">Admin Login</h2>
                <p className="text-muted">Enter your credentials to access the admin panel</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                      Login
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 
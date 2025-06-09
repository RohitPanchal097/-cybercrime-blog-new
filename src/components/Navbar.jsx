import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faUserLock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoggedIn = !!localStorage.getItem('adminToken');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
          CyberCrime Blog
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                    to="/"
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/categories') ? 'active' : ''}`} 
                    to="/categories"
                  >
                    Categories
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="btn btn-outline-light"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                Logout
              </button>
            ) : (
              <Link 
                className={`btn ${isActive('/admin/login') ? 'active' : ''}`} 
                to="/admin/login"
              >
                <FontAwesomeIcon icon={faUserLock} className="me-2" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
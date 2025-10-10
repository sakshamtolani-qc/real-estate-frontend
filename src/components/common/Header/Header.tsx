import { Phone, User, Menu, X, LogOut, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import  './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Quorium" className="logo-image" />
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/properties" className="nav-link">
            Listings
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </nav>

        <div className="header-actions">
          <div className="phone-number">
            <Phone size={16} />
            <span>+91 9026294xxx</span>
          </div>
          {user ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button className="user-button" onClick={toggleUserMenu}>
                <User size={20} />
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <p className="user-name">{user.first_name} {user.last_name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  {(user as any).is_superuser ? (
                    <button className="user-dropdown-item" onClick={() => { navigate('/dashboard'); setIsUserMenuOpen(false); }}>
                      <Home size={16} />
                      <span>Admin Dashboard</span>
                    </button>
                  ) : (user as any).is_employee ? (
                    <button className="user-dropdown-item" onClick={() => { navigate('/agent/dashboard'); setIsUserMenuOpen(false); }}>
                      <Home size={16} />
                      <span>Agent Dashboard</span>
                    </button>
                  ) : (
                    <button className="user-dropdown-item" onClick={() => { navigate('/properties'); setIsUserMenuOpen(false); }}>
                      <Home size={16} />
                      <span>My Properties</span>
                    </button>
                  )}
                  <button className="user-dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="user-button">
              <User size={20} />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Menu Header */}
            <div className="mobile-menu-header">
              <Link to="/" className="mobile-logo" onClick={closeMenu}>
                <img src="/logo.png" alt="Quorium" className="mobile-logo-image" />
              </Link>
              <button className="mobile-close-button" onClick={closeMenu}>
                <X size={24} />
              </button>
            </div>
            
            <nav className="mobile-nav">
              <Link to="/" className="mobile-nav-link" onClick={closeMenu}>
                <span className="nav-text">Home</span>
                <span className="nav-arrow">→</span>
              </Link>
              <Link to="/properties" className="mobile-nav-link" onClick={closeMenu}>
                <span className="nav-text">Listings</span>
                <span className="nav-arrow">→</span>
              </Link>
              <Link to="/about" className="mobile-nav-link" onClick={closeMenu}>
                <span className="nav-text">About</span>
                <span className="nav-arrow">→</span>
              </Link>
              <Link to="/contact" className="mobile-nav-link" onClick={closeMenu}>
                <span className="nav-text">Contact</span>
                <span className="nav-arrow">→</span>
              </Link>
            </nav>
            
            <div className="mobile-actions">
              <div className="mobile-phone-number">
                <Phone size={18} />
                <span>+91 9026294xxx</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import { Phone, User, Menu, X, LogOut, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import  './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { logo, phone, company } = useCompanySettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    // If not on landing page, navigate to it first
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on landing page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    closeMenu();
  };

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
          <img src={logo || "/logo.png"} alt={company} className="logo-image" />
          <span className="logo-text">{company}</span>
        </Link>

        <nav className="nav-menu">
          <a href="#home" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            Home
          </a>
          <Link to="/properties" className="nav-link">
            Listings
          </Link>
          <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
            About
          </a>
          <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
            Contact
          </a>
        </nav>

        <div className="header-actions">
          {phone && (
            <div className="phone-number">
              <Phone size={16} />
              <span><a href={`tel:${phone}`}>{phone}</a></span>
            </div>
          )}
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
            <Link to="/login" className="user-button login-tooltip-container">
              <User size={20} />
              <span className="login-tooltip">Click to Login</span>
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
                <img src={logo || "/logo.png"} alt={company} className="mobile-logo-image" />
              </Link>
              <button className="mobile-close-button" onClick={closeMenu}>
                <X size={24} />
              </button>
            </div>
            
            <nav className="mobile-nav">
              <a href="#home" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                <span className="nav-text">Home</span>
                <span className="nav-arrow">→</span>
              </a>
              <Link to="/properties" className="mobile-nav-link" onClick={closeMenu}>
                <span className="nav-text">Listings</span>
                <span className="nav-arrow">→</span>
              </Link>
              <a href="#about" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
                <span className="nav-text">About</span>
                <span className="nav-arrow">→</span>
              </a>
              <a href="#contact" className="mobile-nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>
                <span className="nav-text">Contact</span>
                <span className="nav-arrow">→</span>
              </a>
            </nav>
            
            <div className="mobile-actions">
              {phone && (
                <div className="mobile-phone-number">
                  <Phone size={18} />
                  <span><a href={`tel:${phone}`}>{phone}</a></span>
                </div>
              )}
              <div className="mobile-user-section">
                {user ? (
                  <div className="mobile-user-menu">
                    <div className="mobile-user-info">
                      <p className="mobile-user-name">{user.first_name} {user.last_name}</p>
                      <p className="mobile-user-email">{user.email}</p>
                    </div>
                    <button className="mobile-user-item" onClick={() => { 
                      if ((user as any).is_superuser) {
                        navigate('/dashboard');
                      } else if ((user as any).is_employee) {
                        navigate('/agent/dashboard');
                      } else {
                        navigate('/properties');
                      }
                      closeMenu();
                    }}>
                      <Home size={16} />
                      <span>{(user as any).is_superuser ? 'Admin' : (user as any).is_employee ? 'Agent' : 'My'} Dashboard</span>
                    </button>
                    <button className="mobile-user-item logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="mobile-login-button" onClick={closeMenu}>
                    <User size={18} />
                    <span>Login / Sign Up</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

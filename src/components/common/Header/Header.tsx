import { Phone, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import  './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
          <button className="user-button">
            <User size={20} />
          </button>
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

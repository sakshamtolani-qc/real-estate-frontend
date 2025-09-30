import { Phone, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import  './Header.css';

export default function Header() {
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
      </div>
    </header>
  );
}

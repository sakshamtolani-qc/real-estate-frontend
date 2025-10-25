import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, Plus, List, Menu, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCompanySettings } from '../../../hooks/useCompanySettings';
import { NotificationBell } from '../NotificationBell/NotificationBell';
import './AgentHeader.css';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  related_data: any;
  action_url: string;
  created_at: string;
  read_at: string | null;
}

export default function AgentHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { logo, company } = useCompanySettings();
  const [isListingsDropdownOpen, setIsListingsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const listingsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listingsRef.current && !listingsRef.current.contains(event.target as Node)) {
        setIsListingsDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    // Use replace to prevent going back to protected pages
    navigate('/login', { replace: true });
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to leads page and open the existing lead detail
    if (notification.related_data && notification.related_data.lead_id) {
      navigate('/agent/leads', { 
        state: { 
          openLeadId: notification.related_data.lead_id,
          leadData: notification.related_data 
        } 
      });
    } else if (notification.action_url) {
      navigate(notification.action_url);
    }
  };


  return (
    <header className="agent-header">
      <div className="agent-header-container">
        {/* Logo */}
        <Link to="/agent/dashboard" className="agent-logo">
          <img src={logo} alt="Company Logo" className="agent-logo-image" />
          <span className="agent-logo-text">{company}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="agent-nav">
          <Link to="/agent/dashboard" className="agent-nav-link">
            Dashboard
          </Link>

          {/* Listings Dropdown */}
          <div className="agent-nav-dropdown" ref={listingsRef}>
            <button
              className="agent-nav-link dropdown-trigger"
              onClick={() => setIsListingsDropdownOpen(!isListingsDropdownOpen)}
            >
              Listings
              <ChevronDown 
                size={16} 
                className={`dropdown-icon ${isListingsDropdownOpen ? 'open' : ''}`}
              />
            </button>
            
            {isListingsDropdownOpen && (
              <div className="agent-dropdown-menu">
                <Link 
                  to="/properties" 
                  className="agent-dropdown-item"
                  onClick={() => setIsListingsDropdownOpen(false)}
                >
                  <List size={16} />
                  <span>All Listings</span>
                </Link>
                <Link 
                  to="/agent/properties/add" 
                  className="agent-dropdown-item"
                  onClick={() => setIsListingsDropdownOpen(false)}
                >
                  <Plus size={16} />
                  <span>Add Listing</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/agent/leads" className="agent-nav-link">
            Leads
          </Link>

          <Link to="/agent/closed-deals" className="agent-nav-link">
            <CheckCircle size={16} />
            Closed Deals
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="agent-header-actions">
          {/* Notifications */}
          <NotificationBell onNotificationClick={handleNotificationClick} />

          {/* User Menu */}
          <div className="agent-user-wrapper" ref={userRef}>
            <button
              className="agent-user-button"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <div className="user-avatar">
                <User size={18} />
              </div>
              <span className="user-name">{user?.first_name || 'Agent'}</span>
              <ChevronDown 
                size={16} 
                className={`dropdown-icon ${isUserDropdownOpen ? 'open' : ''}`}
              />
            </button>

            {isUserDropdownOpen && (
              <div className="agent-dropdown-menu user-menu">
                <div className="user-menu-header">
                  <div className="user-avatar large">
                    <User size={24} />
                  </div>
                  <div className="user-info">
                    <p className="user-full-name">{user?.first_name} {user?.last_name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link 
                  to="/agent/profile" 
                  className="agent-dropdown-item"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <button 
                  className="agent-dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="agent-mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="agent-mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="agent-mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="agent-mobile-menu-header">
              <Link to="/agent/dashboard" className="agent-mobile-logo" onClick={() => setIsMobileMenuOpen(false)}>
                <img src={logo} alt="Company Logo" className="agent-mobile-logo-image" />
                <span className="agent-mobile-logo-text">{company}</span>
              </Link>
              <button 
                className="agent-mobile-close-button"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <nav className="agent-mobile-nav">
              <Link 
                to="/agent/dashboard" 
                className="agent-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/properties" 
                className="agent-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Listings
              </Link>
              <Link 
                to="/agent/properties/add" 
                className="agent-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Add Listing
              </Link>
              <Link 
                to="/agent/leads" 
                className="agent-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Leads
              </Link>
              <Link 
                to="/agent/closed-deals" 
                className="agent-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Closed Deals
              </Link>
            </nav>

            <div className="agent-mobile-footer">
              <div className="agent-mobile-user-info">
                <div className="user-avatar">
                  <User size={20} />
                </div>
                <div>
                  <p className="mobile-user-name">{user?.first_name} {user?.last_name}</p>
                  <p className="mobile-user-email">{user?.email}</p>
                </div>
              </div>
              <button className="agent-mobile-logout-button" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Settings, LogOut, ChevronDown, Plus, List, Menu, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './AdminHeader.css';

export default function AdminHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isListingsDropdownOpen, setIsListingsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const listingsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (listingsRef.current && !listingsRef.current.contains(event.target as Node)) {
        setIsListingsDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
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

  // Dummy notifications - replace with real data later
  const notifications = [
    { id: 1, message: 'New lead assigned to you', time: '5 min ago', unread: true },
    { id: 2, message: 'Property listing approved', time: '1 hour ago', unread: true },
    { id: 3, message: 'Deal closed successfully', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        {/* Logo */}
        <Link to="/dashboard" className="admin-logo">
          <img src="/logo.png" alt="Quorum Property" className="admin-logo-image" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="admin-nav">
          <Link to="/dashboard" className="admin-nav-link">
            Dashboard
          </Link>

          {/* Listings Dropdown */}
          <div className="admin-nav-dropdown" ref={listingsRef}>
            <button
              className="admin-nav-link dropdown-trigger"
              onClick={() => setIsListingsDropdownOpen(!isListingsDropdownOpen)}
            >
              Listings
              <ChevronDown 
                size={16} 
                className={`dropdown-icon ${isListingsDropdownOpen ? 'open' : ''}`}
              />
            </button>
            
            {isListingsDropdownOpen && (
              <div className="admin-dropdown-menu">
                <Link 
                  to="/properties" 
                  className="admin-dropdown-item"
                  onClick={() => setIsListingsDropdownOpen(false)}
                >
                  <List size={16} />
                  <span>All Listings</span>
                </Link>
                <Link 
                  to="/admin/properties/add" 
                  className="admin-dropdown-item"
                  onClick={() => setIsListingsDropdownOpen(false)}
                >
                  <Plus size={16} />
                  <span>Add Listing</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/admin/leads" className="admin-nav-link">
            Leads
          </Link>

          <Link to="/admin/reports" className="admin-nav-link">
            Reports
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="admin-header-actions">
          {/* Notifications */}
          <div className="admin-notification-wrapper" ref={notificationsRef}>
            <button
              className="admin-icon-button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="admin-dropdown-menu notifications-menu">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  <span className="unread-count">{unreadCount} unread</span>
                </div>
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                    >
                      <div className="notification-content">
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      {notification.unread && <div className="unread-dot"></div>}
                    </div>
                  ))}
                </div>
                <Link 
                  to="/admin/notifications" 
                  className="view-all-notifications"
                  onClick={() => setIsNotificationsOpen(false)}
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="admin-user-wrapper" ref={userRef}>
            <button
              className="admin-user-button"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <div className="user-avatar">
                <User size={18} />
              </div>
              <span className="user-name">{user?.first_name || 'Admin'}</span>
              <ChevronDown 
                size={16} 
                className={`dropdown-icon ${isUserDropdownOpen ? 'open' : ''}`}
              />
            </button>

            {isUserDropdownOpen && (
              <div className="admin-dropdown-menu user-menu">
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
                  to="/admin/settings" 
                  className="admin-dropdown-item"
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <button 
                  className="admin-dropdown-item logout-item"
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
          className="admin-mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="admin-mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="admin-mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="admin-mobile-menu-header">
              <Link to="/dashboard" className="admin-mobile-logo" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/logo.png" alt="Quorum Property" className="admin-mobile-logo-image" />
              </Link>
              <button 
                className="admin-mobile-close-button"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <nav className="admin-mobile-nav">
              <Link 
                to="/dashboard" 
                className="admin-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/properties" 
                className="admin-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Listings
              </Link>
              <Link 
                to="/admin/properties/add" 
                className="admin-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Add Listing
              </Link>
              <Link 
                to="/admin/leads" 
                className="admin-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Leads
              </Link>
              <Link 
                to="/admin/reports" 
                className="admin-mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reports
              </Link>
            </nav>

            <div className="admin-mobile-footer">
              <div className="admin-mobile-user-info">
                <div className="user-avatar">
                  <User size={20} />
                </div>
                <div>
                  <p className="mobile-user-name">{user?.first_name} {user?.last_name}</p>
                  <p className="mobile-user-email">{user?.email}</p>
                </div>
              </div>
              <button className="admin-mobile-logout-button" onClick={handleLogout}>
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

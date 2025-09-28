import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Grievance/Feedback Section */}
      <div className="feedback-section">
        <div className="feedback-content">
          <div className="feedback-text">
            <h3>Grievance/Feedback</h3>
            <p>Stay Upto Date</p>
          </div>
          <div className="email-subscription">
            <input 
              type="email" 
              placeholder="Your Email" 
              className="email-input"
            />
            <button className="submit-button">
              <img src="/arrow.png" alt="Submit" className="arrow-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Logo Section */}
          <div className="footer-logo">
            <img src="/logo_big.png" alt="Quorium" className="logo" />
          </div>

          {/* Company Links */}
          <div className="footer-section">
            <h4>COMPANY</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#legal">Legal Information</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#blogs">Blogs</a></li>
            </ul>
          </div>

          {/* Help Center Links */}
          <div className="footer-section">
            <h4>HELP CENTER</h4>
            <ul>
              <li><a href="#find-room">Find a Room</a></li>
              <li><a href="#why-us">Why Us?</a></li>
              <li><a href="#faqs">FAQs</a></li>
              <li><a href="#rental-guides">Rental Guides</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section contact-info">
            <h4>CONTACT INFO</h4>
            <div className="contact-details">
              <p>Phone: 1234567890</p>
              <p>Email: company@email.com</p>
              <p>Location: somewhere</p>
            </div>
            <div className="social-icons">
              <a href="#facebook" className="social-icon">
                <span>f</span>
              </a>
              <a href="#instagram" className="social-icon">
                <span>📷</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
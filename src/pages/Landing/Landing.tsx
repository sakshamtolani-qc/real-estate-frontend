import React, { useState, useEffect } from 'react';
import { Phone, ChevronDown, Search, Users, Key, Star, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import './Landing.css';
import {Footer} from '../../components/common/Footer/Footer';
import Header from '../../components/common/Header/Header';
import { ContactModal } from '../../components/ContactModal/ContactModal';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: '+91 9026404xxx',
    email: 'info@quorumproperty.com',
    address: '123 Property Street, Real Estate District'
  });

  // Update contact info from settings
  useEffect(() => {
    if (settings) {
      setContactInfo({
        phone: settings.phone || '+91 9026404xxx',
        email: settings.email || 'info@quorumproperty.com',
        address: settings.address ? `${settings.address}${settings.city ? ', ' + settings.city : ''}` : '123 Property Street, Real Estate District'
      });
    }
  }, [settings]);

  // Listen for settings updates from other components
  useEffect(() => {
    const handleSettingsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const updatedSettings = customEvent.detail;
      setContactInfo({
        phone: updatedSettings.phone || '+91 9026404xxx',
        email: updatedSettings.email || 'info@quorumproperty.com',
        address: updatedSettings.address ? `${updatedSettings.address}${updatedSettings.city ? ', ' + updatedSettings.city : ''}` : '123 Property Street, Real Estate District'
      });
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'listings', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Handle property click - allow all users to view properties
  const handlePropertyClick = (propertyId: number) => {
    // Navigate to property detail page (no login required)
    navigate(`/property/${propertyId}`);
  };

  const propertyTypes = [
    { title: 'Modern Villa', subtitle: '15 Properties', image: '/mordern-villa.jpg' },
    { title: 'Apartment', subtitle: '3 Properties', image: '/apartment.jpg' },
    { title: 'Single Family', subtitle: '5 Properties', image: '/single-family.jpg' },
    { title: 'Office', subtitle: '2 Properties', image: '/office.jpg' }
  ];

  const featuredProperties = [
    {
      id: 1,
      title: 'Luxury Family Home',
      location: 'Lorem Ipsum',
      price: '395,000 INR',
      beds: 4,
      baths: 3,
      area: '400 sqft',
      image: '/luxury-home.jpg',
      badge: 'FOR SALE',
      badgeColor: 'sale'
    },
    {
      id: 2,
      title: 'Skyper Pool Apartment',
      location: 'Lorem Ipsum',
      price: '280,000 INR',
      beds: 3,
      baths: 2,
      area: '350 sqft',
      image: '/luxury-home.jpg',
      badge: 'FOR SALE',
      badgeColor: 'sale'
    },
    {
      id: 3,
      title: 'North Dillard Street',
      location: 'Lorem Ipsum',
      price: '2500 INR/month',
      beds: 3,
      baths: 2,
      area: '400 sqft',
      image: '/luxury-home.jpg',
      badge: 'FOR RENT',
      badgeColor: 'rent'
    },
    {
      id: 4,
      title: 'Eaton Garth Penthouse',
      location: 'Lorem Ipsum',
      price: '280,000 INR',
      beds: 3,
      baths: 2,
      area: '450 sqft',
      image: '/luxury-home.jpg',
      badge: 'FOR RENT',
      badgeColor: 'rent'
    },
    {
      id: 5,
      title: 'New Apartment Nice View',
      location: 'Lorem Ipsum',
      price: '280,000 INR',
      beds: 2,
      baths: 1,
      area: '350 sqft',
      image: '/luxury-home.jpg',
      badge: 'FOR RENT',
      badgeColor: 'rent'
    },
    {
      id: 6,
      title: 'Diamond Manor Apartment',
      location: 'Lorem Ipsum',
      price: '280,000 INR',
      beds: 3,
      baths: 2,
      area: '500 sqft',
      image: '/luxury-home.jpg',
      badge: 'FOR RENT',
      badgeColor: 'rent'
    }
  ];

  const workSteps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Find Real Estate',
      description: 'Sumo petentium ut per, at his wisim utroque voluptatibus. Est et quaestio.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Meet Relator',
      description: 'Sumo petentium ut per, at his wisim utroque voluptatibus. Est et quaestio.'
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: 'Take The Keys',
      description: 'Sumo petentium ut per, at his wisim utroque voluptatibus. Est et quaestio.'
    }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <Header/>
      {/* <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-logo">
              <img src="/logo.png" alt="Quorum Property" className="head-logo-image" />
            </div>
            
            <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
              <a 
                href="#home" 
                className={activeSection === 'home' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
              >
                Home <ChevronDown className="w-4 h-4" />
              </a>
              <a 
                href="#listings"
                className={activeSection === 'listings' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('listings'); }}
              >
                Listings <ChevronDown className="w-4 h-4" />
              </a>
              <a 
                href="#about"
                className={activeSection === 'about' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              >
                About
              </a>
             
            </nav>

            <div className="header-right">
              <div className="phone">
                <Phone className="w-4 h-4" />
                <span>+91 9026404xxx</span>
              </div>
              <div className="user-icon">
                <div className="avatar"></div>
              </div>
            </div>

            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Your Next<br />
                <span className="highlight">Property</span>, Just a<br />
                <span className="highlight">Click</span> Away.
              </h1>
              <button className="cta-button" onClick={() => scrollToSection('contact')}>LET US GUIDE YOUR JOURNEY</button>
            </div>
            <div className="hero-image">
              <img src="/building1.png" alt="Buildings" />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Properties Section */}
      <section className="explore-properties">
        <div className="container">
          <div className="section-header">
            <h2 onClick={() => navigate('/properties')} style={{ cursor: 'pointer' }}>Explore Our <span className="highlight">Properties</span></h2>
            <p>Lorem ipsum dolor sit amet</p>
          </div>
          
          <div className="property-types">
            {propertyTypes.map((type, index) => (
              <div key={index} className="landing-property-card" onClick={() => navigate('/properties')} style={{ cursor: 'pointer' }}>
                <img src={type.image} alt={type.title} className="landing-property-image" />
                <div className="landing-property-overlay">
                  <h3>{type.title}</h3>
                  <p>{type.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="listings" className="landing-featured-section">
        <div className="container">
          <div className="landing-featured-header">
            <div className="landing-featured-title">
              <h2>Featured <span className="highlight">Properties</span></h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="landing-featured-filters">
              <button className="landing-filter-btn landing-filter-active">All Properties</button>
              <button className="landing-filter-btn">For Sale</button>
              <button className="landing-filter-btn">For Rent</button>
            </div>
          </div>

          <div className="properties-grid">
            {featuredProperties.map((property) => (
              <div key={property.id} className="property-card" onClick={() => handlePropertyClick(property.id)} style={{ cursor: 'pointer' }}>
                <div className="property-image">
                  <img src={property.image} alt={property.title} />
                  <div className={`property-badge ${property.badgeColor}`}>
                    {property.badge}
                  </div>
                </div>
                <div className="property-info">
                  <h3>{property.title}</h3>
                  <p className="location">{property.location}</p>
                  <div className="property-details">
                    <span>{property.beds} Beds</span>
                    <span>{property.baths} Baths</span>
                    <span>{property.area}</span>
                  </div>
                  <div className="property-price">{property.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It <span className="highlight">works</span>? <span onClick={() => navigate('/properties')} style={{ cursor: 'pointer' }}>Find a <span className="highlight">perfect</span> home</span></h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <div className="work-steps">
            {workSteps.map((step, index) => (
              <div key={index} className="work-step">
                <div className="step-icon">
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Section
      <section className="discover-section">
        <div className="discover-overlay">
          <div className="container">
            <div className="discover-content">
              <h2>Discover a <span className="highlight">place</span> you'll love to <span className="highlight">live</span></h2>
              <p>Reference site about Lorem Ipsum, giving information on its origins as well as a random Lipsum generator.</p>
              <button className="cta-button-secondary">Get Started</button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonials-content">
            <div className="testimonials-left">
              <h2>What our customers are <span className="highlight">saying</span> us?</h2>
              <p>Various versions have evolved over the years, sometimes by accident, sometimes on purpose injected humour and the like.</p>
              <div className="testimonial-stats">
                {/* <div className="stat">
                  <h3>10m+</h3>
                  <p>Happy People</p>
                </div>
                <div className="stat">
                  <h3>4.88</h3>
                  <p>Overall rating</p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 filled" />
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
            <div className="testimonials-right">
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <img src="/avatar.jpg" alt="Customer" className="testimonial-avatar" />
                  <div>
                    <h4>Lorem Ipsum</h4>
                    <p>Lorem</p>
                  </div>
                </div>
                <div className="testimonial-text">
                  <p>"Lorem ipsum dolor multiples, property comparisons, and the loan estimator. Works great. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="landing-about-section">
        <div className="container">
          <div className="landing-about-content">
            <div className="landing-about-left">
              <h2>Discover More <span className="highlight">About</span><br />Properties</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              <div className="landing-about-links">
                <button className="landing-about-link">Ask A Question</button>
                <button className="landing-about-link">Find A Property</button>
              </div>
              <button className="landing-about-cta" onClick={() => scrollToSection('contact')}>Let Us Guide Your Home</button>
            </div>
            <div className="landing-about-right">
              <div className="landing-about-single-image">
                <img src="/about.jpg" alt="About Us" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Get in <span className="highlight">Touch</span></h2>
            <p>Ready to find your dream property? Contact us today and let us help you make it happen.</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={24} />
                </div>
                <h4>Call Us</h4>
                <p>{contactInfo.phone}</p>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4>Email Us</h4>
                <p>{contactInfo.email}</p>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4>Visit Us</h4>
                <p>{contactInfo.address}</p>
              </div>
            </div>
            
            <div className="contact-cta">
              <button 
                className="contact-button"
                onClick={() => setIsContactModalOpen(true)}
              >
                Send us a Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        type="general"
      />

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Landing;
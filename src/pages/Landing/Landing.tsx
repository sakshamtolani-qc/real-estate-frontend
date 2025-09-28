import React, { useState, useEffect } from 'react';
import { Phone, ChevronDown, Search, Users, Key, Star, Menu, X } from 'lucide-react';
import './Landing.css';
import Footer from '../../components/common/Footer/Footer';

const Landing: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

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

  const propertyTypes = [
    { title: 'Modern Villa', subtitle: '15 Properties', image: '/modern-villa.jpg' },
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
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <img src="/logo.svg" alt="Quorum Property" className="logo-image" />
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
              {/* <a 
                href="#contact"
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              >
                Contact
              </a> */}
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
      </header>

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
              <button className="cta-button">LET US GUIDE YOUR HOME</button>
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
            <h2>Explore Our <span className="highlight">Properties</span></h2>
            <p>Lorem ipsum dolor sit amet</p>
          </div>
          
          <div className="property-types">
            {propertyTypes.map((type, index) => (
              <div key={index} className="property-type-card">
                <img src={type.image} alt={type.title} />
                <div className="property-type-info">
                  <h3>{type.title}</h3>
                  <p>{type.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="listings" className="featured-properties">
        <div className="container">
          <div className="section-header">
            <h2>Featured <span className="highlight">Properties</span></h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="section-filters">
              <button className="filter-active">All Properties</button>
              <button>For Sale</button>
              <button>For Rent</button>
            </div>
          </div>

          <div className="properties-grid">
            {featuredProperties.map((property) => (
              <div key={property.id} className="property-card">
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
            <h2>How It <span className="highlight">works</span>? Find a <span className="highlight">perfect</span> home</h2>
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
                <div className="stat">
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
                </div>
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
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About <span className="highlight">Quorum Property</span></h2>
              <p>We are a leading real estate company dedicated to helping you find your perfect home. With years of experience in the property market, our team of expert realtors provides personalized service to match you with properties that suit your lifestyle and budget.</p>
              <p>From luxury villas to modern apartments, we offer a diverse portfolio of properties across prime locations. Our commitment to excellence and customer satisfaction has made us a trusted partner for thousands of property buyers and sellers.</p>
              <div className="about-features">
                <div className="feature">
                  <h4>Expert Guidance</h4>
                  <p>Professional realtors with deep market knowledge</p>
                </div>
                <div className="feature">
                  <h4>Diverse Portfolio</h4>
                  <p>Wide range of properties to suit every need</p>
                </div>
                <div className="feature">
                  <h4>Trusted Service</h4>
                  <p>Proven track record of successful transactions</p>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="/about.jpg" alt="About Us" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {/* <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Get in <span className="highlight">Touch</span></h2>
            <p>Ready to find your dream property? Contact us today and let us help you make it happen.</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <h4>Call Us</h4>
                <p>+91 9026404xxx</p>
              </div>
              <div className="contact-item">
                <h4>Email Us</h4>
                <p>info@quorumproperty.com</p>
              </div>
              <div className="contact-item">
                <h4>Visit Us</h4>
                <p>123 Property Street, Real Estate District, City 12345</p>
              </div>
            </div>
            
            <div className="contact-form">
              <form>
                <div className="form-row">
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-row">
                  <input type="tel" placeholder="Your Phone" required />
                  <select required>
                    <option value="">Property Type</option>
                    <option value="villa">Villa</option>
                    <option value="apartment">Apartment</option>
                    <option value="office">Office</option>
                  </select>
                </div>
                <textarea placeholder="Your Message" rows={4} required></textarea>
                <button type="submit" className="cta-button">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Landing;
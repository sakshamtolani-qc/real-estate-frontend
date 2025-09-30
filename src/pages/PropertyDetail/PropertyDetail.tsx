import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Heart, Share2, Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Header from '../../components/common/Header/Header';
import {Footer} from '../../components/common/Footer/Footer';
import './PropertyDetail.css';

const mockPropertyData = {
  id: 1,
  title: 'Diamond Manor Apartment',
  price: '50,00,000 INR',
  location: 'Lorem Ipsum',
  bedrooms: 3,
  bathrooms: 2,
  area: 500,
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  images: [
    '/P1a.png',
    '/P1b.png',
    '/P1c.png',
    '/P1d.png',
    '/P1e.png'
  ],
  subtitle: 'SUKH SYNTHIES'
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScheduleCall = () => {
    alert('Schedule a call functionality will be implemented with backend');
  };

  const openCarousel = () => {
    setCurrentImageIndex(0);
    setIsCarouselOpen(true);
  };

  const closeCarousel = () => {
    setIsCarouselOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockPropertyData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockPropertyData.images.length - 1 : prev - 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isCarouselOpen) return;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeCarousel();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isCarouselOpen]);

  // Prevent body scroll when carousel is open
  useEffect(() => {
    if (isCarouselOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCarouselOpen]);

  const handleFavorite = () => {
    alert('Favorite functionality will be implemented with backend');
  };

  const handleShare = () => {
    alert('Share functionality will be implemented with backend');
  };

  return (
    <div className="property-detail-page">
      <Header />

      <main className="property-detail-main">
        <div className="property-detail-container">
          <div className="property-detail-content">
            <div className="property-gallery-section">
              <div className="main-image-wrapper">
                <img
                  src={mockPropertyData.images[0]}
                  alt={mockPropertyData.title}
                  className="main-property-image"
                />
              </div>

              <div className="gallery-grid">
                {mockPropertyData.images.slice(1, 4).map((image, index) => (
                  <div key={index} className="gallery-image-wrapper">
                    <img
                      src={image}
                      alt={`Property view ${index + 1}`}
                      className="gallery-image"
                    />
                  </div>
                ))}
                <div className="gallery-image-wrapper more-photos" onClick={openCarousel}>
                  <img
                    src={mockPropertyData.images[4]}
                    alt="More photos"
                    className="gallery-image"
                  />
                  <div className="more-photos-overlay">
                    <span>+2</span>
                    <span>Photos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="property-info-section">
              <div className="property-description-card">
                <h1 className="section-title">Property Description</h1>
                <p className="property-subtitle">{mockPropertyData.subtitle}</p>

                <div className="description-text">
                  {mockPropertyData.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="property-sidebar">
            <div className="property-card-sticky">
              <div className="property-actions-header">
                <button
                  className="icon-button"
                  onClick={handleFavorite}
                  aria-label="Add to favorites"
                >
                  <Heart size={20} />
                </button>
                <button
                  className="icon-button"
                  onClick={handleShare}
                  aria-label="Share property"
                >
                  <Share2 size={20} />
                </button>
              </div>

              <div className="property-price-section">
                <span className="property-detail-price">₹ {mockPropertyData.price}</span>
              </div>

              <h2 className="property-detail-title">{mockPropertyData.title}</h2>

              <div className="property-detail-location">
                <MapPin size={16} />
                <span>{mockPropertyData.location}</span>
              </div>

              <div className="property-detail-features">
                <div className="feature-item">
                  <Bed size={18} />
                  <span>{mockPropertyData.bedrooms} BHK</span>
                </div>
                <div className="feature-item">
                  <Bath size={18} />
                  <span>{mockPropertyData.bathrooms} Baths</span>
                </div>
                <div className="feature-item">
                  <Maximize size={18} />
                  <span>{mockPropertyData.area} sqft</span>
                </div>
              </div>

              <button
                className="schedule-call-btn"
                onClick={handleScheduleCall}
              >
                Schedule a call
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Image Carousel Modal */}
      {isCarouselOpen && (
        <div className="carousel-overlay" onClick={closeCarousel}>
          <div className="carousel-modal" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className="carousel-close" onClick={closeCarousel}>
              <X size={24} />
            </button>
            
            {/* Image Counter */}
            <div className="carousel-counter">
              {currentImageIndex + 1} / {mockPropertyData.images.length}
            </div>
            
            {/* Main Image */}
            <div className="carousel-image-container">
              <img 
                src={mockPropertyData.images[currentImageIndex]} 
                alt={`Property view ${currentImageIndex + 1}`}
                className="carousel-image"
              />
            </div>
            
            {/* Navigation Arrows */}
            <button className="carousel-arrow carousel-prev" onClick={prevImage}>
              <ChevronLeft size={32} />
            </button>
            <button className="carousel-arrow carousel-next" onClick={nextImage}>
              <ChevronRight size={32} />
            </button>
            
            {/* Thumbnail Strip */}
            <div className="carousel-thumbnails">
              {mockPropertyData.images.map((image, index) => (
                <div 
                  key={index}
                  className={`carousel-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header/Header';
import AdminHeader from '../../components/common/AdminHeader/AdminHeader';
import {Footer} from '../../components/common/Footer/Footer';
import { ContactModal } from '../../components/ContactModal/ContactModal';
import { PageLoader } from '../../components/common/Loader';
import api from '../../services/api';
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
    '/P1d-3.png',
    '/P1e-4.png',
    '/P1a.png'
  ],
  subtitle: 'sdkvnsivnsv'
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check if user is an employee/admin (multiple ways for compatibility)
  const isAdmin = Boolean(
    user?.is_employee || 
    user?.is_superuser ||
    user?.role === 'admin' || 
    user?.role === 'agent' ||
    (user as any)?.is_employee === true
  );
  
  // Fetch property data from database
  useEffect(() => {
    const fetchProperty = async () => {
      const startTime = Date.now();
      try {
        setIsLoading(true);
        const response: any = await api.get(`/properties/detail/${id}/`);
        const data = response.data || response;
        
        // Map backend data to frontend format
        // Use backend images as-is, or fall back to static placeholder if no images
        const defaultImages = [
          '/P1a.png',
          '/P1b.png',
          '/P1c.png',
          '/P1d-3.png',
          '/P1e-4.png'
        ];
        
        const mappedProperty = {
          id: data.id,
          title: data.title || 'Untitled Property',
          price: data.price ? `${data.price}` : '0',
          location: data.location || 'Location not specified',
          bedrooms: data.bedrooms || 0,
          bathrooms: data.bathrooms || 0,
          area: data.area || 0,
          description: data.description || 'No description available.',
          images: (data.images && data.images.length > 0) ? data.images : defaultImages,
          subtitle: data.subtitle || data.property_type || ''
        };
        
        setProperty(mappedProperty);
    } catch (error) {
      // Use mock data as fallback
      setProperty(mockPropertyData);
      } finally {
        // Ensure loader shows for at least 1 second
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);
  

  const handleFavorite = () => {
    toast.info('Favorite functionality coming soon!');
  };

  const handleShare = () => {
    // Copy link to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Property link copied to clipboard!');
    } else {
      toast.info('Share functionality coming soon!');
    }
  };

  const openCarousel = (index: number) => {
    setCurrentImageIndex(index);
    setShowCarousel(true);
  };

  const nextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleDeleteProperty = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/properties/delete/${property.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Property deleted successfully!');
        setShowDeleteModal(false);
        // Redirect to properties list after 1.5 seconds
        setTimeout(() => {
          navigate('/properties', { replace: true });
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to delete property');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the property');
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading state
  if (isLoading || !property) {
    return <PageLoader message="Loading Property Details..." fullScreen={true} />;
  }

  return (
    <div className="property-detail-page">
      {isAdmin ? <AdminHeader /> : <Header />}

      <main className="property-detail-main">
        <div className="property-detail-container">
          <section className="property-gallery-section">
            <div className="gallery-grid-layout">
              <div className="main-image-container" onClick={() => openCarousel(0)}>
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="main-gallery-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/P1a.png';
                  }}
                />
              </div>

              <div className="side-images-grid">
                {property.images.slice(1, 4).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="side-image-container"
                    onClick={() => openCarousel(index + 1)}
                  >
                    <img
                      src={image}
                      alt={`Property view ${index + 1}`}
                      className="side-gallery-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/P1b.png';
                      }}
                    />
                  </div>
                ))}
                {property.images.length > 4 && (
                  <div
                    className="side-image-container more-photos-container"
                    onClick={() => openCarousel(4)}
                  >
                    <img
                      src={property.images[4]}
                      alt="More photos"
                      className="side-gallery-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/P1c.png';
                      }}
                    />
                    <div className="more-photos-overlay">
                      <span className="more-photos-number">+{property.images.length - 4}</span>
                      <span className="more-photos-text">More<br/>Photos</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="property-content-wrapper">
            <section className="property-description-section">
              <div className="description-header">
                <div>
                  <h1 className="property-description-title">Property Description</h1>
                  <p className="property-subtitle-text">{property.subtitle}</p>
                </div>
                <div className="description-actions">
                  <button className="action-icon-btn" onClick={handleFavorite} aria-label="Add to favorites">
                    <Heart size={22} />
                  </button>
                  <button className="action-icon-btn" onClick={handleShare} aria-label="Share property">
                    <Share2 size={22} />
                  </button>
                  {isAdmin && (
                    <button 
                      className="action-icon-btn delete-btn" 
                      onClick={() => setShowDeleteModal(true)}
                      aria-label="Delete property"
                      title="Delete property - Only available for agents and admins"
                    >
                      <Trash2 size={22} />
                    </button>
                  )}
                </div>
              </div>

              <div className="description-content">
                {property.description.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="description-paragraph">{paragraph}</p>
                ))}
              </div>
            </section>

            <aside className="pricing-card-section">
              <div className="pricing-card">
                <div className="pricing-card-price">₹ {property.price} INR</div>

                <h2 className="pricing-card-title">{property.title}</h2>

                <div className="pricing-card-location">
                  <MapPin size={16} />
                  <span>{property.location}</span>
                </div>

                <div className="pricing-card-features">
                  <div className="pricing-feature-item">
                    <Bed size={18} />
                    <span>{property.bedrooms} BHK</span>
                  </div>
                  <div className="pricing-feature-item">
                    <Bath size={18} />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="pricing-feature-item">
                    <Maximize size={18} />
                    <span>{property.area} sqft</span>
                  </div>
                </div>

                <button
                  className="schedule-call-button"
                  onClick={() => setShowContactModal(true)}
                >
                  Schedule a Visit
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {showCarousel && (
        <div className="carousel-modal" onClick={() => setShowCarousel(false)}>
          <button className="carousel-close" onClick={() => setShowCarousel(false)}>
            <X size={32} />
          </button>
          <button className="carousel-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <ChevronLeft size={40} />
          </button>
          <div className="carousel-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={property.images[currentImageIndex]}
              alt={`Property view ${currentImageIndex + 1}`}
              className="carousel-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/P1a.png';
              }}
            />
          </div>
          <button className="carousel-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => !isDeleting && setShowDeleteModal(false)}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <Trash2 size={32} className="delete-modal-icon" />
              <h2 className="delete-modal-title">Delete Property</h2>
            </div>
            <p className="delete-modal-message">
              Are you sure you want to delete <strong>"{property.title}"</strong>? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button
                className="delete-modal-btn cancel-btn"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="delete-modal-btn delete-btn"
                onClick={handleDeleteProperty}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Property'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal for scheduling visits */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
        type="property"
        propertyId={property.id}
      />

      <Footer />
    </div>
  );
}

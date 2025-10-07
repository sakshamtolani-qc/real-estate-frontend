import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, Bed, Bath, Maximize, MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header/Header';
import AdminHeader from '../../components/common/AdminHeader/AdminHeader';
import {Footer} from '../../components/common/Footer/Footer';
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
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    callTime: '',
    date: '',
    termsAccepted: false,
    privacyAccepted: false
  });
  
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
      try {
        setIsLoading(true);
        const response: any = await api.get(`/properties/detail/${id}/`);
        const data = response.data || response;
        
        // Map backend data to frontend format
        // Generate default images based on property ID
        const propertyImageNum = ((data.id - 1) % 6) + 1;
        const defaultImages = [
          `/property${propertyImageNum}-1.png`,
          `/property${propertyImageNum}-2.png`,
          `/property${propertyImageNum}-3.png`,
          `/property${propertyImageNum}-4.png`,
          `/property${propertyImageNum}-5.png`,
          `/property${propertyImageNum}-6.png`
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
          images: data.images && data.images.length > 0 ? data.images : defaultImages,
          subtitle: data.subtitle || data.property_type || ''
        };
        
        setProperty(mappedProperty);
      } catch (error) {
        console.error('Failed to fetch property:', error);
        // Use mock data as fallback
        setProperty(mockPropertyData);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);
  
  // Debug log
  console.log('PropertyDetail - User:', user);
  console.log('PropertyDetail - isAdmin:', isAdmin);

  const handleFavorite = () => {
    alert('Favorite functionality will be implemented with backend');
  };

  const handleShare = () => {
    alert('Share functionality will be implemented with backend');
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

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.termsAccepted || !scheduleForm.privacyAccepted) {
      alert('Please accept both terms and conditions');
      return;
    }
    console.log('Schedule form submitted:', scheduleForm);
    alert('Call scheduled successfully!');
    setShowScheduleModal(false);
    setScheduleForm({
      callTime: '',
      date: '',
      termsAccepted: false,
      privacyAccepted: false
    });
  };

  // Show loading state
  if (isLoading || !property) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading property details...</div>;
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
                  onClick={() => setShowScheduleModal(true)}
                >
                  Schedule a call
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
            />
          </div>
          <button className="carousel-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <ChevronRight size={40} />
          </button>
        </div>
      )}

      {showScheduleModal && (
        <div className="schedule-modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowScheduleModal(false)}>
              <X size={24} />
            </button>

            <div className="modal-gallery-preview">
              {mockPropertyData.images.slice(0, 3).map((image, index) => (
                <img key={index} src={image} alt={`Preview ${index + 1}`} className="modal-preview-image" />
              ))}
            </div>

            <h2 className="schedule-modal-title">Schedule A Call</h2>

            <form className="schedule-form" onSubmit={handleScheduleSubmit}>
              <div className="form-group">
                <label htmlFor="callTime">When would you like to receive a call?</label>
                <select
                  id="callTime"
                  value={scheduleForm.callTime}
                  onChange={(e) => setScheduleForm({...scheduleForm, callTime: e.target.value})}
                  required
                >
                  <option value="">Select time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Enter the date</label>
                <input
                  type="date"
                  id="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={scheduleForm.termsAccepted}
                    onChange={(e) => setScheduleForm({...scheduleForm, termsAccepted: e.target.checked})}
                  />
                  <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                </label>
              </div>

              <div className="form-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={scheduleForm.privacyAccepted}
                    onChange={(e) => setScheduleForm({...scheduleForm, privacyAccepted: e.target.checked})}
                  />
                  <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                </label>
              </div>

              <button type="submit" className="schedule-submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

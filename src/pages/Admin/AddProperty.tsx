import { useState, useEffect } from 'react';
import { Minus, Plus, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/common/AdminHeader/AdminHeader';
import AgentHeader from '../../components/common/AgentHeader/AgentHeader';
import {Footer} from '../../components/common/Footer/Footer';
import './AddProperty.css';

interface PropertyType {
  id: number;
  name: string;
  description: string;
}

const AddProperty = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [location, setLocation] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [rooms, setRooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/properties/types/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPropertyTypes(data.results || []);
    } catch (err) {
      console.error('Failed to fetch property types', err);
    }
  };

  const handleIncrement = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(prev => prev + 1);
  };

  const handleDecrement = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(prev => Math.max(0, prev - 1));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handlePostRoom = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      // Validation
      if (!title || !selectedPropertyType || !location || !description) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      if (listingType === 'sale' && !salePrice) {
        setError('Please enter a sale price');
        setSubmitting(false);
        return;
      }

      if (listingType === 'rent' && !rentPrice) {
        setError('Please enter a rent price');
        setSubmitting(false);
        return;
      }

      // Create FormData to handle both data and files
      const formData = new FormData();
      formData.append('title', title);
      formData.append('property_type_id', selectedPropertyType);
      formData.append('listing_type', listingType);
      formData.append('status', 'available');
      formData.append('address', location);
      formData.append('city', location.split(',')[0]?.trim() || location);
      formData.append('state', location.split(',')[1]?.trim() || '');
      formData.append('zip_code', '');
      formData.append('location', location);
      formData.append('bedrooms', rooms.toString());
      formData.append('bathrooms', bathrooms.toString());
      formData.append('square_feet', squareFeet || '0');
      formData.append('parking_spaces', '0');
      formData.append('has_pool', 'false');
      formData.append('has_garden', 'false');
      formData.append('furnished_status', '');
      formData.append('sale_price', listingType === 'sale' ? salePrice : '');
      formData.append('rent_price', listingType === 'rent' ? rentPrice : '');
      formData.append('description', description);
      formData.append('featured', featured.toString());
      
      // Append images
      photos.forEach((photo) => {
        formData.append('images', photo);
      });

      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/properties/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - let browser set it with boundary for multipart
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        // Reset form
        setTitle('');
        setSelectedPropertyType('');
        setLocation('');
        setSalePrice('');
        setRentPrice('');
        setSquareFeet('');
        setRooms(0);
        setBathrooms(0);
        setDescription('');
        setFeatured(false);
        setPhotos([]);
        
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } else {
        setError(data.message || 'Failed to create property');
      }
    } catch (err) {
      setError('An error occurred while creating the property');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreview = () => {
    const priceValue = listingType === 'sale' ? `₹${salePrice}` : `₹${rentPrice}/month`;
    const propertyData = {
      title,
      propertyType: propertyTypes.find(t => t.id === parseInt(selectedPropertyType))?.name || 'N/A',
      listingType,
      location,
      price: priceValue,
      squareFeet,
      rooms,
      bathrooms,
      description,
      featured,
      photos: photos.length
    };

    console.log('Preview property:', propertyData);
    alert(`Preview:\n\nTitle: ${title}\nType: ${propertyData.propertyType}\nListing: ${listingType}\nLocation: ${location}\nPrice: ${priceValue}\nBedrooms: ${rooms} BHK\nBathrooms: ${bathrooms}\nArea: ${squareFeet || 'N/A'} sqft\nFeatured: ${featured ? 'Yes' : 'No'}\nDescription: ${description}\nPhotos: ${photos.length}`);
  };

  // Determine which header to show based on user role
  const isAgent = user?.role === 'agent' || (user?.is_employee && !user?.is_superuser);
  const HeaderComponent = isAgent ? AgentHeader : AdminHeader;

  return (
    <div className="add-property-page">
      <HeaderComponent />

      <main className="add-property-main">
        <div className="add-property-container">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <section className="property-description-section">
            <h1 className="section-title">
              Add Property <span className="highlight">Listing</span>
            </h1>

            <div className="input-grid">
              <div className="input-card">
                <label className="input-label">Property Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="property-input"
                  placeholder="e.g., Luxury Family Home"
                />
              </div>

              <div className="input-card">
                <label className="input-label">Property Type *</label>
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="property-input"
                >
                  <option value="">Select Type</option>
                  {propertyTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-card">
                <label className="input-label">Listing Type *</label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value as 'sale' | 'rent')}
                  className="property-input"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div className="input-card">
                <label className="input-label">Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="property-input"
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>

              {listingType === 'sale' && (
                <div className="input-card">
                  <label className="input-label">Sale Price * (₹)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="property-input"
                    placeholder="5000000"
                  />
                </div>
              )}

              {listingType === 'rent' && (
                <div className="input-card">
                  <label className="input-label">Rent Price * (₹/month)</label>
                  <input
                    type="number"
                    value={rentPrice}
                    onChange={(e) => setRentPrice(e.target.value)}
                    className="property-input"
                    placeholder="25000"
                  />
                </div>
              )}

              <div className="input-card">
                <label className="input-label">Area (sqft)</label>
                <input
                  type="number"
                  value={squareFeet}
                  onChange={(e) => setSquareFeet(e.target.value)}
                  className="property-input"
                  placeholder="450"
                />
              </div>
            </div>

            <div className="checkbox-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span>Featured Property</span>
              </label>
            </div>
          </section>

          <section className="facilities-section">
            <h2 className="section-title">
              Property <span className="highlight">Details</span>
            </h2>

            <div className="facilities-grid">
              <div className="facility-counter">
                <button
                  onClick={() => handleDecrement(setRooms)}
                  className="counter-btn"
                  aria-label="Decrease rooms"
                >
                  <Minus size={20} />
                </button>
                <div className="counter-display">
                  <span className="counter-value">{rooms}</span>
                  <span className="counter-label">Rooms</span>
                </div>
                <button
                  onClick={() => handleIncrement(setRooms)}
                  className="counter-btn"
                  aria-label="Increase rooms"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="facility-counter">
                <button
                  onClick={() => handleDecrement(setBathrooms)}
                  className="counter-btn"
                  aria-label="Decrease bathrooms"
                >
                  <Minus size={20} />
                </button>
                <div className="counter-display">
                  <span className="counter-value">{bathrooms}</span>
                  <span className="counter-label">Bathrooms</span>
                </div>
                <button
                  onClick={() => handleIncrement(setBathrooms)}
                  className="counter-btn"
                  aria-label="Increase bathrooms"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </section>

          <section className="room-description-section">
            <div className="room-description-grid">
              <div className="description-area">
                <h2 className="section-title">
                  Property <span className="highlight">Description</span>
                </h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="description-textarea"
                  placeholder="Describe the property features, amenities, and highlights..."
                />
                <div className="action-buttons">
                  <button 
                    onClick={handlePostRoom} 
                    className="post-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating Property...' : 'Create Property'}
                  </button>
                  <button onClick={handlePreview} className="preview-btn" disabled={submitting}>
                    Preview
                  </button>
                </div>
              </div>

              <div className="upload-area">
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden-input"
                />
                <label htmlFor="photo-upload" className="upload-box">
                  <div className="upload-content">
                    <div className="upload-icon">
                      <Plus size={48} />
                    </div>
                    <div className="upload-text">
                      <span className="upload-label">Upload</span>
                      <span className="upload-label-highlight">Photos</span>
                    </div>
                    <p className="upload-hint">First image will be the main listing photo</p>
                  </div>
                </label>
                {photos.length > 0 && (
                  <div className="uploaded-photos">
                    <div className="photos-header">
                      <span className="photos-count">{photos.length} photo(s) selected</span>
                    </div>
                    <div className="photos-preview">
                      {photos.map((photo, index) => (
                        <div key={index} className="photo-preview-item">
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt={`Preview ${index + 1}`}
                            className="photo-preview-image"
                          />
                          {index === 0 && (
                            <span className="primary-badge">Main</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddProperty;

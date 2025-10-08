import { useState } from 'react';
import { Minus, Plus, Upload } from 'lucide-react';
import Header from '../../components/common/AdminHeader/AdminHeader';
import {Footer} from '../../components/common/Footer/Footer';
import './AddProperty.css';

const AddProperty = () => {
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [area, setArea] = useState('');
  const [rooms, setRooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [parking, setParking] = useState(0);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

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
    const propertyData = {
      location,
      priceRange,
      area,
      rooms,
      bathrooms,
      parking,
      description,
      photos: photos.map(p => p.name)
    };

    console.log('Posting property:', propertyData);
    alert('Property posted successfully!');
  };

  const handlePreview = () => {
    const propertyData = {
      location,
      priceRange,
      area,
      rooms,
      bathrooms,
      parking,
      description,
      photos: photos.length
    };

    console.log('Preview property:', propertyData);
    alert(`Preview:\n\nLocation: ${location}\nPrice Range: ${priceRange}\nArea: ${area}\nRooms: ${rooms}\nBathrooms: ${bathrooms}\nParking: ${parking}\nDescription: ${description}\nPhotos: ${photos.length}`);
  };

  return (
    <div className="add-property-page">
      <Header />

      <main className="add-property-main">
        <div className="add-property-container">
          <section className="property-description-section">
            <h1 className="section-title">
              Add a short <span className="highlight">description</span> of your property
            </h1>

            <div className="input-grid">
              <div className="input-card">
                <label className="input-label">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="property-input"
                  placeholder=""
                />
              </div>

              <div className="input-card">
                <label className="input-label">Price Range</label>
                <input
                  type="text"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="property-input"
                  placeholder=""
                />
              </div>

              <div className="input-card">
                <label className="input-label">Area</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="property-input"
                  placeholder=""
                />
              </div>
            </div>
          </section>

          <section className="facilities-section">
            <h2 className="section-title">
              Add facilities <span className="highlight">available</span> at your place.
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

              <div className="facility-counter">
                <button
                  onClick={() => handleDecrement(setParking)}
                  className="counter-btn"
                  aria-label="Decrease parking"
                >
                  <Minus size={20} />
                </button>
                <div className="counter-display">
                  <span className="counter-value">{parking}</span>
                  <span className="counter-label">Parking</span>
                </div>
                <button
                  onClick={() => handleIncrement(setParking)}
                  className="counter-btn"
                  aria-label="Increase parking"
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
                  Room <span className="highlight">Description</span>
                </h2>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="description-textarea"
                  placeholder="Lorem Ipsum"
                />
                <div className="action-buttons">
                  <button onClick={handlePostRoom} className="post-btn">
                    Post My Room
                  </button>
                  <button onClick={handlePreview} className="preview-btn">
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
                  </div>
                </label>
                {photos.length > 0 && (
                  <div className="uploaded-count">
                    {photos.length} photo(s) selected
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

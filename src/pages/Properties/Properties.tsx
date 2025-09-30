import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, SlidersHorizontal } from 'lucide-react';
import Header from '../../components/common/Header/Header';
import {Footer} from '../../components/common/Footer/Footer';
import './Properties.css';

type PropertyType = 'all' | 'sale' | 'rent';
type FilterType = 'Studio Apartment' | '1 BHK' | '2 BHK' | '3 BHK' | 'Paint house' | 'Modern Villa' | 'Office';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  status: 'FOR SALE' | 'FOR RENT';
  featured?: boolean;
  type: FilterType;
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Luxury Family Home',
    price: '395,000 INR',
    location: 'Lorem Ipsum',
    bedrooms: 4,
    bathrooms: 1,
    area: 450,
    image: '/P1.png',
    status: 'FOR SALE',
    featured: true,
    type: '3 BHK'
  },
  {
    id: 2,
    title: 'Skyper Pool Apartment',
    price: '280,000 INR',
    location: 'Lorem Ipsum',
    bedrooms: 3,
    bathrooms: 2,
    area: 450,
    image: '/P2.png',
    status: 'FOR SALE',
    type: '2 BHK'
  },
  {
    id: 3,
    title: 'North Dillard Street',
    price: '250 INR/month',
    location: 'Lorem Ipsum',
    bedrooms: 3,
    bathrooms: 2,
    area: 400,
    image: '/P3.png',
    status: 'FOR RENT',
    featured: true,
    type: 'Modern Villa'
  },
  {
    id: 4,
    title: 'Eaton Garth Penthouse',
    price: '280,000 INR',
    location: 'Lorem Ipsum',
    bedrooms: 3,
    bathrooms: 2,
    area: 450,
    image: '/P1.png',
    status: 'FOR SALE',
    featured: true,
    type: '3 BHK'
  },
  {
    id: 5,
    title: 'New Apartment Nice View',
    price: '200,000 INR',
    location: 'Lorem Ipsum',
    bedrooms: 2,
    bathrooms: 1,
    area: 450,
    image: '/P2.png',
    status: 'FOR RENT',
    featured: true,
    type: '2 BHK'
  },
  {
    id: 6,
    title: 'Diamond Manor Apartment',
    price: '',
    location: 'Lorem Ipsum',
    bedrooms: 3,
    bathrooms: 1,
    area: 500,
    image: '/P3.png',
    status: 'FOR SALE',
    featured: true,
    type: '3 BHK'
  },
  {
    id: 7,
    title: 'Luxury Family Home',
    price: '395,000 INR',
    location: 'Lorem Ipsum',
    bedrooms: 4,
    bathrooms: 1,
    area: 450,
    image: '/P1.png',
    status: 'FOR SALE',
    featured: true,
    type: '3 BHK'
  },
  {
    id: 8,
    title: 'Skyper Pool Apartment',
    price: '280,000 INR',
    location: 'Lorem Ipsum',
    bedrooms: 3,
    bathrooms: 2,
    area: 450,
    image: '/P2.png',
    status: 'FOR SALE',
    type: '2 BHK'
  },
  {
    id: 9,
    title: 'North Dillard Street',
    price: '250 INR/month',
    location: 'Lorem Ipsum',
    bedrooms: 3,
    bathrooms: 2,
    area: 400,
    image: '/P3.png',
    status: 'FOR RENT',
    featured: true,
    type: 'Modern Villa'
  }
];

export default function Properties() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<PropertyType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>([]);

  const filterOptions: FilterType[] = [
    'Studio Apartment',
    '1 BHK',
    '2 BHK',
    '3 BHK',
    'Paint house',
    'Modern Villa',
    'Office'
  ];

  const filteredProperties = mockProperties.filter(property => {
    const typeMatch = selectedType === 'all' ||
      (selectedType === 'sale' && property.status === 'FOR SALE') ||
      (selectedType === 'rent' && property.status === 'FOR RENT');

    const filterMatch = selectedFilters.length === 0 || selectedFilters.includes(property.type);

    return typeMatch && filterMatch;
  });

  const handlePropertyClick = (id: number) => {
    navigate(`/property/${id}`);
  };

  const toggleFilter = (filter: FilterType) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="properties-page">
      <Header />

      <main className="properties-main">
        <div className="properties-container">
          <h1 className="properties-title">Listed Properties</h1>

          <div className="properties-controls">
            <div className="type-filters">
              <button
                className={`type-filter-btn ${selectedType === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedType('all')}
              >
                All Properties
              </button>
              <button
                className={`type-filter-btn ${selectedType === 'sale' ? 'active' : ''}`}
                onClick={() => setSelectedType('sale')}
              >
                For Sale
              </button>
              <button
                className={`type-filter-btn ${selectedType === 'rent' ? 'active' : ''}`}
                onClick={() => setSelectedType('rent')}
              >
                For Rent
              </button>
            </div>

            <div className="filters-dropdown">
              <button
                className="filters-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              {showFilters && (
                <div className="filters-menu">
                  {filterOptions.map(filter => (
                    <label key={filter} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(filter)}
                        onChange={() => toggleFilter(filter)}
                      />
                      <span>{filter}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="properties-grid">
            {filteredProperties.map(property => (
              <div
                key={property.id}
                className="property-card"
                onClick={() => handlePropertyClick(property.id)}
              >
                <div className="property-image-wrapper">
                  <img src={property.image} alt={property.title} className="property-image" />
                  <div className="property-badges">
                    <span className={`property-status ${property.status === 'FOR SALE' ? 'sale' : 'rent'}`}>
                      {property.status}
                    </span>
                    {property.featured && (
                      <span className="property-featured">FEATURED</span>
                    )}
                  </div>
                </div>

                <div className="property-content">
                  <div className="property-header">
                    <h3 className="property-title-text">{property.title}</h3>
                    {property.price && (
                      <span className="property-price">{property.price}</span>
                    )}
                  </div>

                  <div className="property-location">
                    <MapPin size={14} />
                    <span>{property.location}</span>
                  </div>

                  <div className="property-features">
                    <div className="feature">
                      <Bed size={16} />
                      <span>{property.bedrooms} BHK</span>
                    </div>
                    <div className="feature">
                      <Bath size={16} />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="feature">
                      <Maximize size={16} />
                      <span>{property.area} sqft</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

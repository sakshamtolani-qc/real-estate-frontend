import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/common/Header/Header';
import AdminHeader from '../../components/common/AdminHeader/AdminHeader';
import AgentHeader from '../../components/common/AgentHeader/AgentHeader';
import {Footer} from '../../components/common/Footer/Footer';
import { PageLoader, SearchLoader } from '../../components/common/Loader';
import api from '../../services/api';
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
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<PropertyType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  
  // Check user role for header selection (optional, properties page doesn't require auth)
  const isAdmin = Boolean(user?.is_superuser);
  const isAgent = Boolean(user?.is_employee);
  
  // Fetch properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      const startTime = Date.now();
      try {
        setIsLoadingProperties(true);
        console.log('Fetching properties from API...');
        const response: any = await api.get('/properties/list/');
        console.log('Raw API response:', response);
        
        const data = response.data || response;
        console.log('Data after parsing:', data);
        console.log('Is data an array?', Array.isArray(data));
        console.log('Data type:', typeof data);
        
        // Get the actual properties array
        let propertiesArray = data;
        if (data && typeof data === 'object' && data.results) {
          propertiesArray = data.results;
        } else if (!Array.isArray(data)) {
          console.error('Unexpected data format:', data);
          propertiesArray = [];
        }
        
        console.log('Properties array to map:', propertiesArray);
        console.log('Properties array length:', propertiesArray.length);
        
        // Map backend data to frontend format
        const mappedProperties: Property[] = propertiesArray.map((prop: any, index: number) => {
          // Use property images from public folder (property1.png, property2.png, etc.)
          // Cycle through images if there are more properties than images
          const imageNumber = (index % 6) + 1; // Assuming 6 property images available
          const defaultImage = `/property${imageNumber}.png`;
          
          // Parse area - extract number from string like "5000 sqft"
          let areaValue = 0;
          if (typeof prop.area === 'string') {
            const match = prop.area.match(/\d+/);
            areaValue = match ? parseInt(match[0]) : 0;
          } else if (typeof prop.area === 'number') {
            areaValue = prop.area;
          }
          
          return {
            id: prop.id,
            title: prop.title || 'Untitled Property',
            price: prop.price || '',
            location: prop.location || 'Location not specified',
            bedrooms: prop.bedrooms || 0,
            bathrooms: prop.bathrooms || 0,
            area: areaValue,
            image: prop.image || defaultImage,
            status: prop.status || 'FOR SALE',  // Use status directly from API
            featured: prop.featured || false,
            type: prop.type || '3 BHK'  // Use type directly from API
          };
        });
        
        console.log('Mapped properties:', mappedProperties);
        console.log('Total properties fetched:', mappedProperties.length);
        console.log('First property image:', mappedProperties[0]?.image);
        console.log('All property images:', mappedProperties.map(p => ({ id: p.id, image: p.image })));
        setProperties(mappedProperties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        // Keep empty array if fetch fails
        setProperties([]);
      } finally {
        // Ensure loader shows for at least 1 second
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);
        setTimeout(() => {
          setIsLoadingProperties(false);
        }, remainingTime);
      }
    };

    fetchProperties();
  }, []);
  
  // Allow all users to view properties (no login required)
  // This page is accessible without authentication
  
  // Show loading state only for properties (not authentication)
  if (isLoadingProperties) {
    return <PageLoader message="Loading Properties..." fullScreen={true} />;
  }

  const filterOptions: FilterType[] = [
    'Studio Apartment',
    '1 BHK',
    '2 BHK',
    '3 BHK',
    'Paint house',
    'Modern Villa',
    'Office'
  ];

  const filteredProperties = properties.filter(property => {
    const typeMatch = selectedType === 'all' ||
      (selectedType === 'sale' && property.status === 'FOR SALE') ||
      (selectedType === 'rent' && property.status === 'FOR RENT');

    const filterMatch = selectedFilters.length === 0 || selectedFilters.includes(property.type);

    return typeMatch && filterMatch;
  });
  
  // Debug logging (commented out to reduce noise)
  // console.log('Total properties:', properties.length);
  // console.log('Filtered properties:', filteredProperties.length);
  // console.log('Selected type:', selectedType);
  // console.log('Selected filters:', selectedFilters);

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
      {isAdmin ? <AdminHeader /> : isAgent ? <AgentHeader /> : <Header />}

      <main className="properties-main">
        <div className="properties-container">
          <h1 className="properties-title">Listed <span className="properties-highlight">Properties</span></h1>

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
            {filteredProperties.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 20px',
                color: '#666'
              }}>
                <h3>No properties found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <p style={{ marginTop: '10px', fontSize: '14px' }}>
                  Total properties in database: {properties.length}
                </p>
              </div>
            ) : (
              filteredProperties.map(property => (
                <div
                  key={property.id}
                  className="property-card"
                  onClick={() => handlePropertyClick(property.id)}
                >
                <div className="property-image-wrapper">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="property-image"
                    onError={(e) => {
                      console.error(`Image failed for property ${property.id}:`, property.image);
                      (e.target as HTMLImageElement).src = '/P1.png';
                    }}
                    onLoad={(e) => {
                      console.log(`Image loaded successfully for property ${property.id}:`, property.image);
                    }}
                  />
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
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

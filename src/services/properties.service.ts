import { apiService } from './api';
import { ApiResponse } from '@/types';

// Property interfaces for backend data
export interface BackendProperty {
  id: string;
  uuid: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  status: string;
  type: string;
  featured: boolean;
}

export interface BackendPropertyDetail {
  id: string;
  uuid: string;
  title: string;
  description: string;
  property_type: {
    id: string;
    name: string;
    description: string;
  };
  listing_type: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  area: string;
  sale_price?: string;
  rent_price?: string;
  price: string;
  images: string[];
  has_pool: boolean;
  has_garden: boolean;
  parking_spaces: number;
  featured: boolean;
  views_count: number;
  date_listed: string;
}

// Frontend property interface (what components expect)
export interface FrontendProperty {
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
  type: string;
}

export interface FrontendPropertyDetail {
  id: number;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  images: string[];
  subtitle: string;
}

// Utility functions to map backend data to frontend format
const mapBackendPropertyToFrontend = (backendProperty: BackendProperty): FrontendProperty => {
  return {
    id: parseInt(backendProperty.id) || Math.random(), // Convert UUID to number or use random
    title: backendProperty.title,
    price: backendProperty.price,
    location: backendProperty.location,
    bedrooms: backendProperty.bedrooms,
    bathrooms: backendProperty.bathrooms,
    area: parseInt(backendProperty.area.replace(' sqft', '')) || 0,
    image: backendProperty.image.startsWith('/api/') 
      ? '/P1.png' // Use placeholder image for now
      : backendProperty.image,
    status: backendProperty.status as 'FOR SALE' | 'FOR RENT',
    featured: backendProperty.featured,
    type: backendProperty.type,
  };
};

const mapBackendPropertyDetailToFrontend = (backendProperty: BackendPropertyDetail): FrontendPropertyDetail => {
  return {
    id: parseInt(backendProperty.id) || Math.random(),
    title: backendProperty.title,
    price: backendProperty.price,
    location: backendProperty.location,
    bedrooms: backendProperty.bedrooms,
    bathrooms: backendProperty.bathrooms,
    area: backendProperty.square_feet,
    description: backendProperty.description || 'No description available.',
    images: backendProperty.images.map(img => 
      img.startsWith('/api/') ? '/P1a.png' : img
    ),
    subtitle: `${backendProperty.property_type.name} in ${backendProperty.city}`,
  };
};

// API service functions
export const propertiesService = {
  // Get all properties
  getAllProperties: async (): Promise<FrontendProperty[]> => {
    try {
      const response = await apiService.get<BackendProperty[]>('/properties/');
      if (Array.isArray(response)) {
        return response.map(mapBackendPropertyToFrontend);
      }
      return [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  // Get featured properties
  getFeaturedProperties: async (): Promise<FrontendProperty[]> => {
    try {
      const response = await apiService.get<BackendProperty[]>('/properties/featured/');
      if (Array.isArray(response)) {
        return response.map(mapBackendPropertyToFrontend);
      }
      return [];
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      return [];
    }
  },

  // Get property by ID
  getPropertyById: async (id: string): Promise<FrontendPropertyDetail | null> => {
    try {
      const response = await apiService.get<BackendPropertyDetail>(`/properties/${id}/`);
      if (response) {
        return mapBackendPropertyDetailToFrontend(response);
      }
      return null;
    } catch (error) {
      console.error('Error fetching property details:', error);
      return null;
    }
  },

  // Search properties with filters
  searchProperties: async (filters: {
    listing_type?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    bathrooms?: number;
    city?: string;
    search?: string;
  }): Promise<FrontendProperty[]> => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const url = `/properties/search/?${params.toString()}`;
      const response = await apiService.get<BackendProperty[]>(url);
      
      if (Array.isArray(response)) {
        return response.map(mapBackendPropertyToFrontend);
      }
      return [];
    } catch (error) {
      console.error('Error searching properties:', error);
      return [];
    }
  },

  // Get recent properties
  getRecentProperties: async (): Promise<FrontendProperty[]> => {
    try {
      const response = await apiService.get<BackendProperty[]>('/properties/recent/');
      if (Array.isArray(response)) {
        return response.map(mapBackendPropertyToFrontend);
      }
      return [];
    } catch (error) {
      console.error('Error fetching recent properties:', error);
      return [];
    }
  },
};
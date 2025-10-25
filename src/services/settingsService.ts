import axios from 'axios';

// Get API base URL - default to localhost:8000
// For production, set VITE_API_BASE_URL in .env file
const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL) || 'http://localhost:8000/api';

export interface CompanySettings {
  id?: number;
  company_name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  about: string;
  policies: string;
  logo?: File;
  logo_url?: string;
  additional_emails: string[];
  additional_phones: string[];
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  business_hours: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

class SettingsService {
  private cacheKey = 'company_settings_cache';
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached settings from localStorage
   */
  private getCachedSettings(): CompanySettings | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - timestamp > this.cacheDuration) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      localStorage.removeItem(this.cacheKey);
      return null;
    }
  }

  /**
   * Set settings cache
   */
  private setCachedSettings(settings: CompanySettings): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        data: settings,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching settings:', error);
    }
  }

  /**
   * Clear settings cache
   */
  private clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }

  /**
   * Fetch company settings with caching
   */
  async fetchSettings(useCache = true): Promise<CompanySettings> {
    try {
      // Try to get from cache first
      if (useCache) {
        const cached = this.getCachedSettings();
        if (cached) {
          return cached;
        }
      }

      const response = await axios.get(`${API_BASE_URL}/leads/settings/`);

      if (response.data.success) {
        const settings = response.data.data;
        this.setCachedSettings(settings);
        return settings;
      }

      throw new Error(response.data.message || 'Failed to fetch settings');
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Return default settings if fetch fails
      return this.getDefaultSettings();
    }
  }

  /**
   * Update company settings
   */
  async updateSettings(settings: Partial<CompanySettings>, token?: string): Promise<CompanySettings> {
    try {
      const formData = new FormData();

      // Add all fields to FormData
      Object.keys(settings).forEach((key) => {
        const value = (settings as any)[key];

        if (key === 'logo' && value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.put(
        `${API_BASE_URL}/leads/admin/settings/`,
        formData,
        {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        const updatedSettings = response.data.data;
        this.setCachedSettings(updatedSettings);
        return updatedSettings;
      }

      throw new Error(response.data.message || 'Failed to update settings');
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  /**
   * Get default settings
   */
  getDefaultSettings(): CompanySettings {
    return {
      company_name: 'Real Estate CRM',
      country: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      about: '',
      policies: '',
      additional_emails: [],
      additional_phones: [],
      facebook_url: '',
      twitter_url: '',
      instagram_url: '',
      linkedin_url: '',
      business_hours: {}
    };
  }

  /**
   * Invalidate cache - useful after updates
   */
  invalidateCache(): void {
    this.clearCache();
  }

  /**
   * Get logo URL
   */
  getLogoUrl(logoUrl?: string): string | null {
    if (!logoUrl) return null;
    if (logoUrl.startsWith('http')) return logoUrl;
    return logoUrl;
  }
}

export const settingsService = new SettingsService();

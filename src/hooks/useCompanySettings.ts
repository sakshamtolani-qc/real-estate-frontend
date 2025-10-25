import { useContext } from 'react';
import { useSettings } from '../context/SettingsContext';

/**
 * Custom hook to easily access company settings in any component
 * Usage:
 * const { company, phone, email, logo } = useCompanySettings();
 */
export const useCompanySettings = () => {
  let settings, isLoading, error, refreshSettings;
  
  try {
    const contextData = useSettings();
    settings = contextData.settings;
    isLoading = contextData.isLoading;
    error = contextData.error;
    refreshSettings = contextData.refreshSettings;
  } catch (err) {
    // If SettingsProvider is not available, return default settings
    console.warn('SettingsProvider not found, using default settings');
    return {
      company: 'Real Estate CRM',
      phone: '',
      email: '',
      logo: '/logo.svg',
      address: '',
      city: '',
      country: '',
      about: '',
      policies: '',
      additionalEmails: [],
      additionalPhones: [],
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      businessHours: {},
      isLoading: false,
      error: 'SettingsProvider not available',
      refreshSettings: async () => {},
      fullSettings: null
    };
  }

  return {
    company: settings?.company_name || 'Real Estate CRM',
    phone: settings?.phone || '',
    email: settings?.email || '',
    logo: settings?.logo_url || '/logo.svg',
    address: settings?.address || '',
    city: settings?.city || '',
    country: settings?.country || '',
    about: settings?.about || '',
    policies: settings?.policies || '',
    additionalEmails: settings?.additional_emails || [],
    additionalPhones: settings?.additional_phones || [],
    facebook: settings?.facebook_url || '',
    twitter: settings?.twitter_url || '',
    instagram: settings?.instagram_url || '',
    linkedin: settings?.linkedin_url || '',
    businessHours: settings?.business_hours || {},
    isLoading,
    error,
    refreshSettings,
    fullSettings: settings
  };
};

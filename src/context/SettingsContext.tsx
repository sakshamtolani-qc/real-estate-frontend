import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CompanySettings, settingsService } from '../services/settingsService';

interface SettingsContextType {
  settings: CompanySettings | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: (useCache?: boolean) => Promise<void>;
  updateSettings: (updates: Partial<CompanySettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch settings from backend or cache
   */
  const fetchSettings = useCallback(async (useCache = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await settingsService.fetchSettings(useCache);
      setSettings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(errorMessage);
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update settings
   */
  const updateSettings = useCallback(async (updates: Partial<CompanySettings>) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const updated = await settingsService.updateSettings(updates, token || undefined);
      setSettings(updated);
      // Dispatch custom event for other components to listen to
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: updated }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh settings bypassing cache
   */
  const refreshSettings = useCallback(async () => {
    await fetchSettings(false);
  }, [fetchSettings]);

  /**
   * Load settings on mount (only once)
   */
  useEffect(() => {
    let isMounted = true;
    
    const loadSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await settingsService.fetchSettings(true);
        if (isMounted) {
          setSettings(data);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
          setError(errorMessage);
          console.error('Error fetching settings:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSettings();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - load only on mount

  /**
   * Listen for settings update events from other tabs/windows
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'company_settings_cache') {
        // Use cache=true to use the newly stored data instead of fetching again
        fetchSettings(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchSettings]); // fetchSettings is stable now, minimal re-renders

  const value: SettingsContextType = {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
    refreshSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Hook to use settings context
 */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

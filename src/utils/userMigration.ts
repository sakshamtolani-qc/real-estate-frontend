/**
 * User data migration utility
 * Handles updating user data structure in localStorage without requiring manual clearing
 */

interface StoredUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_employee?: boolean;
  is_client?: boolean;
  is_superuser?: boolean;
  [key: string]: any;
}

const USER_DATA_VERSION = '1.0.0';
const VERSION_KEY = 'user_data_version';

/**
 * Migrate user data to include missing fields
 */
export const migrateUserData = (): StoredUser | null => {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const userDataString = localStorage.getItem('auth_user');
    
    if (!userDataString) {
      return null;
    }

    const userData: StoredUser = JSON.parse(userDataString);
    
    // If version matches, no migration needed
    if (storedVersion === USER_DATA_VERSION) {
      return userData;
    }

    console.log('Migrating user data to version', USER_DATA_VERSION);

    // Migrate: Add missing fields based on existing data
    const migratedUser: StoredUser = {
      ...userData,
      // If is_employee is missing but user is superuser, set is_employee to true
      is_employee: userData.is_employee ?? (userData.is_superuser ? true : false),
      // If is_client is missing, set based on is_employee
      is_client: userData.is_client ?? (!userData.is_employee && !userData.is_superuser),
      // Ensure phone exists (even if empty string)
      phone: userData.phone ?? '',
    };

    // Save migrated data
    localStorage.setItem('auth_user', JSON.stringify(migratedUser));
    localStorage.setItem(VERSION_KEY, USER_DATA_VERSION);

    console.log('User data migrated successfully:', migratedUser);
    return migratedUser;
  } catch (error) {
    console.error('Error migrating user data:', error);
    return null;
  }
};

/**
 * Check if user data needs refresh from backend
 * This can be called periodically to sync with backend
 */
export const needsUserDataRefresh = (): boolean => {
  try {
    const userDataString = localStorage.getItem('auth_user');
    if (!userDataString) return false;

    const userData: StoredUser = JSON.parse(userDataString);
    
    // Check if critical fields are missing
    const hasCriticalFields = 
      userData.hasOwnProperty('is_employee') &&
      userData.hasOwnProperty('is_client');

    return !hasCriticalFields;
  } catch (error) {
    console.error('Error checking user data:', error);
    return false;
  }
};

/**
 * Refresh user data from backend without logging out
 */
export const refreshUserData = async (token: string): Promise<StoredUser | null> => {
  try {
    const response = await fetch('http://localhost:8000/api/accounts/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const userData = await response.json();
    
    // Update localStorage with fresh data
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem(VERSION_KEY, USER_DATA_VERSION);

    console.log('User data refreshed from backend:', userData);
    return userData;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return null;
  }
};

/**
 * Initialize user data on app load
 * Call this when the app starts
 */
export const initializeUserData = (): StoredUser | null => {
  return migrateUserData();
};

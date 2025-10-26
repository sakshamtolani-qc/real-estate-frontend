import api from './api';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_employee: boolean;
  is_client: boolean;
  is_superuser: boolean;
  profile_photo_url?: string;
  profile_photo?: string;
  city: string;
  country: string;
  address: string;
  about: string;
}

class ProfileService {
  /**
   * Get authenticated user's profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>('/accounts/profile/');
      console.log('Profile fetched successfully:', response);
      return response.data as unknown as UserProfile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const formData = new FormData();
      
      // Add profile fields
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'profile_photo_url') {
          if (value && typeof value === 'object' && 'name' in value && 'size' in value) {
            formData.append(key, value as File);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      const response = await api.put<UserProfile>('/accounts/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Profile updated successfully:', response);
      return response.data as unknown as UserProfile;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }

  /**
   * Update profile with photo file
   */
  async updateProfileWithPhoto(
    profileData: Partial<UserProfile>,
    photoFile?: File
  ): Promise<UserProfile> {
    try {
      const formData = new FormData();
      
      // Add profile fields
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'profile_photo_url') {
          formData.append(key, String(value));
        }
      });
      
      // Add photo if provided
      if (photoFile) {
        formData.append('profile_photo', photoFile);
      }
      
      const response = await api.put<UserProfile>('/accounts/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Profile with photo updated successfully:', response);
      return response.data as unknown as UserProfile;
    } catch (error) {
      console.error('Failed to update profile with photo:', error);
      throw error;
    }
  }
}

const profileService = new ProfileService();
export default profileService;

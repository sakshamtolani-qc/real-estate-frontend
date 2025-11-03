import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Upload, AlertCircle, CheckCircle, Camera, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import AdminHeader from '../../components/common/AdminHeader';
import AgentHeader from '../../components/common/AgentHeader';
import { Footer } from '../../components/common/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import profileService, { UserProfile } from '../../services/profileService';

interface ContactInfo {
  email: string;
  emailTimestamp: string;
  phone: string;
  phoneTimestamp: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    address: '',
    about: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [secondaryPhones, setSecondaryPhones] = useState<string[]>([]);
  const [secondaryEmails, setSecondaryEmails] = useState<string[]>([]);
  const [showAddPhone, setShowAddPhone] = useState(false);
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, token, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getProfile();
      setProfileData(profile);
      if (profile.profile_photo_url) {
        setPhotoPreview(profile.profile_photo_url);
      } else if (profile.profile_photo) {
        setPhotoPreview(profile.profile_photo);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      let response;
      if (profilePhoto) {
        response = await profileService.updateProfileWithPhoto(profileData, profilePhoto);
      } else {
        response = await profileService.updateProfile(profileData);
      }

      setProfileData(response);
      
      // Update the AuthContext with the new user data
      updateUser({
        first_name: response.first_name,
        last_name: response.last_name,
        email: response.email,
        phone: response.phone,
        profile_photo_url: response.profile_photo_url,
        profile_photo: response.profile_photo,
      });
      
      // Set photo preview with the new URL
      if (response.profile_photo_url) {
        setPhotoPreview(response.profile_photo_url);
      }
      
      setSuccess('Profile updated successfully!');
      setProfilePhoto(null);
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addPhoneNumber = () => {
    if (!newPhone.trim()) {
      setPhoneError('Phone number cannot be empty');
      return;
    }
    if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(newPhone.trim())) {
      setPhoneError('Please enter a valid phone number');
      return;
    }
    setSecondaryPhones([...secondaryPhones, newPhone]);
    setNewPhone('');
    setPhoneError(null);
    setShowAddPhone(false);
  };

  const removePhoneNumber = (index: number) => {
    setSecondaryPhones(secondaryPhones.filter((_, i) => i !== index));
  };

  const addEmailAddress = () => {
    if (!newEmail.trim()) {
      setEmailError('Email cannot be empty');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (secondaryEmails.includes(newEmail.toLowerCase())) {
      setEmailError('This email already exists');
      return;
    }
    setSecondaryEmails([...secondaryEmails, newEmail]);
    setNewEmail('');
    setEmailError(null);
    setShowAddEmail(false);
  };

  const removeEmailAddress = (index: number) => {
    setSecondaryEmails(secondaryEmails.filter((_, i) => i !== index));
  };

  const contactInfo: ContactInfo = {
    email: profileData.email || '',
    emailTimestamp: 'Just now',
    phone: profileData.phone || 'Not provided',
    phoneTimestamp: 'Just now'
  };

  if (loading) {
    return (
      <div className="profile-container">
        {user?.is_superuser ? <AdminHeader /> : <AgentHeader />}
        <main className="profile-main">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <p>Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-container">
      {user?.is_superuser ? <AdminHeader /> : <AgentHeader />}
      
      <main className="profile-main">
        <div className="profile-hero">
          <h1 className="profile-title">
            My <span className="profile-title-highlight">Profile</span>
          </h1>
        </div>

        {error && (
          <div className="profile-alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="profile-alert alert-success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <div className="profile-content">
          <div className="profile-header-section">
            <div className="profile-avatar-container">
              <div className="profile-avatar-wrapper-container">
                <div className="profile-avatar-wrapper">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="profile-avatar-image" />
                  ) : (
                    <div className="profile-avatar">
                      <User className="profile-avatar-icon" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label htmlFor="photo-input" className="camera-icon-overlay">
                    <Camera size={24} />
                  </label>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-input"
                id="photo-input"
              />
              <div className="profile-user-info">
                <h2 className="profile-user-name">{profileData.first_name} {profileData.last_name}</h2>
                <p className="profile-user-email">{profileData.email}</p>
              </div>
            </div>
            <button 
              className="profile-edit-button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="profile-form-grid">
            <div className="profile-form-group">
              <label className="profile-label">First Name</label>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={profileData.first_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Last Name</label>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={profileData.last_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={profileData.phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={profileData.country || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label">City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={profileData.city || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={profileData.address || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-input"
              />
            </div>

            <div className="profile-form-group profile-form-group-full">
              <label className="profile-label">About</label>
              <textarea
                name="about"
                placeholder="About yourself"
                value={profileData.about || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-textarea"
                rows={3}
              />
            </div>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button 
                className="profile-save-button"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          <div className="profile-contact-section">
            <h3 className="profile-section-title">Contact Info</h3>
            
            {/* Primary Contact Info */}
            <div className="profile-contact-grid">
              <div className="profile-contact-item">
                <div className="profile-contact-icon-wrapper">
                  <Mail className="profile-contact-icon" />
                </div>
                <div className="profile-contact-details">
                  <p className="profile-contact-value">{contactInfo.email}</p>
                  <p className="profile-contact-timestamp">{contactInfo.emailTimestamp}</p>
                </div>
              </div>

              <div className="profile-contact-item">
                <div className="profile-contact-icon-wrapper">
                  <Phone className="profile-contact-icon" />
                </div>
                <div className="profile-contact-details">
                  <p className="profile-contact-value">{contactInfo.phone}</p>
                  <p className="profile-contact-timestamp">{contactInfo.phoneTimestamp}</p>
                </div>
              </div>
            </div>

            {/* Secondary Emails */}
            {secondaryEmails.length > 0 && (
              <div className="profile-secondary-contact">
                <h4 className="profile-secondary-title">Additional Emails</h4>
                <div className="profile-secondary-list">
                  {secondaryEmails.map((email, index) => (
                    <div key={index} className="profile-secondary-item">
                      <Mail size={16} className="profile-secondary-icon" />
                      <span>{email}</span>
                      {isEditing && (
                        <button
                          className="profile-remove-btn"
                          onClick={() => removeEmailAddress(index)}
                          title="Remove email"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Phones */}
            {secondaryPhones.length > 0 && (
              <div className="profile-secondary-contact">
                <h4 className="profile-secondary-title">Additional Phone Numbers</h4>
                <div className="profile-secondary-list">
                  {secondaryPhones.map((phone, index) => (
                    <div key={index} className="profile-secondary-item">
                      <Phone size={16} className="profile-secondary-icon" />
                      <span>{phone}</span>
                      {isEditing && (
                        <button
                          className="profile-remove-btn"
                          onClick={() => removePhoneNumber(index)}
                          title="Remove phone"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Email Form */}
            {isEditing && showAddEmail && (
              <div className="profile-add-contact-form">
                <h4 className="profile-add-title">Add Email Address</h4>
                <div className="profile-add-form-group">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      setEmailError(null);
                    }}
                    className="profile-add-input"
                  />
                  {emailError && <p className="profile-input-error">{emailError}</p>}
                  <div className="profile-add-form-buttons">
                    <button
                      className="profile-add-confirm-btn"
                      onClick={addEmailAddress}
                    >
                      Add
                    </button>
                    <button
                      className="profile-add-cancel-btn"
                      onClick={() => {
                        setShowAddEmail(false);
                        setNewEmail('');
                        setEmailError(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Phone Form */}
            {isEditing && showAddPhone && (
              <div className="profile-add-contact-form">
                <h4 className="profile-add-title">Add Phone Number</h4>
                <div className="profile-add-form-group">
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={newPhone}
                    onChange={(e) => {
                      setNewPhone(e.target.value);
                      setPhoneError(null);
                    }}
                    className="profile-add-input"
                  />
                  {phoneError && <p className="profile-input-error">{phoneError}</p>}
                  <div className="profile-add-form-buttons">
                    <button
                      className="profile-add-confirm-btn"
                      onClick={addPhoneNumber}
                    >
                      Add
                    </button>
                    <button
                      className="profile-add-cancel-btn"
                      onClick={() => {
                        setShowAddPhone(false);
                        setNewPhone('');
                        setPhoneError(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Buttons */}
            {isEditing && (
              <div className="profile-contact-actions">
                {!showAddEmail && (
                  <div className="profile-contact-action-group">
                    <button
                      className="profile-add-contact-btn"
                      onClick={() => setShowAddEmail(true)}
                      title="Add email address"
                    >
                      <Plus size={20} />
                    </button>
                    <span className="profile-contact-guide-text">Add Email</span>
                  </div>
                )}
                {!showAddPhone && (
                  <div className="profile-contact-action-group">
                    <button
                      className="profile-add-contact-btn"
                      onClick={() => setShowAddPhone(true)}
                      title="Add phone number"
                    >
                      <Plus size={20} />
                    </button>
                    <span className="profile-contact-guide-text">Add Phone</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;

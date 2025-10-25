import { useState, useEffect } from 'react';
import { Mail, Phone, Send, Loader } from 'lucide-react';
import Header from '../../components/common/AdminHeader/AdminHeader';
import {Footer} from '../../components/common/Footer/Footer';
import { useSettings } from '../../context/SettingsContext';
import { toast } from '../../utils';
import './Settings.css';

const Settings = () => {
  const { settings, isLoading, updateSettings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({
    company_name: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    policies: '',
    about: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    linkedin_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Load settings into form when they're fetched
  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || '',
        country: settings.country || '',
        city: settings.city || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        policies: settings.policies || '',
        about: settings.about || '',
        facebook_url: settings.facebook_url || '',
        twitter_url: settings.twitter_url || '',
        instagram_url: settings.instagram_url || '',
        linkedin_url: settings.linkedin_url || ''
      });
      if (settings.logo_url) {
        setLogoPreview(settings.logo_url);
      }
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const updates: any = { ...formData };
      
      // If logo file is selected, it will be uploaded to Cloudinary by the backend
      // We just need to include it in the FormData
      if (logoFile) {
        updates.logo = logoFile;
      }

      await updateSettings(updates);
      toast.success('Logo and settings updated successfully!');
      setLogoFile(null); // Reset file input after successful upload
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    // Trigger save when edit is confirmed
    handleSaveSettings();
  };

  const handleAddEmail = () => {
    if (newEmail) {
      const additional_emails = settings?.additional_emails || [];
      if (!additional_emails.includes(newEmail)) {
        updateSettings({
          additional_emails: [...additional_emails, newEmail]
        }).then(() => {
          setNewEmail('');
          toast.success('Email added successfully!');
        }).catch(() => {
          toast.error('Failed to add email');
        });
      }
    }
  };

  const handleAddPhone = () => {
    if (newPhone) {
      const additional_phones = settings?.additional_phones || [];
      if (!additional_phones.includes(newPhone)) {
        updateSettings({
          additional_phones: [...additional_phones, newPhone]
        }).then(() => {
          setNewPhone('');
          toast.success('Phone added successfully!');
        }).catch(() => {
          toast.error('Failed to add phone');
        });
      }
    }
  };

  return (
    <div className="settings-page">
      <Header />

      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>
        <div className="settings-underline"></div>

        {isLoading ? (
          <div className="settings-loading">
            <Loader className="spinner" />
            <p>Loading settings...</p>
          </div>
        ) : (
          <>
            <div className="settings-profile-section">
              <div className="settings-profile-info">
                <div className="settings-avatar">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Company Logo" />
                  ) : (
                    <img src="/logo.svg" alt="Default Logo" />
                  )}
                </div>
                <div className="settings-profile-details">
                  <h2>{formData.company_name || 'Company'}</h2>
                  <p>{formData.email || 'email@example.com'}</p>
                </div>
              </div>
              <button
                className="settings-edit-btn"
                onClick={handleEdit}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>

            <form>
              <div className="settings-form-grid">
                <div className="settings-form-group">
                  <label htmlFor="company_name">Company Name</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    className="settings-input"
                    placeholder="Company Name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="settings-form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="settings-input"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="settings-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="settings-input"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="settings-form-group">
                  <label htmlFor="logo">Company Logo</label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    className="settings-input"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </div>

                <div className="settings-form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    className="settings-input"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="settings-form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="settings-input"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="settings-form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="settings-input"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

            <div className="settings-form-group settings-form-group-full">
              <label htmlFor="policies">Policies</label>
              <textarea
                id="policies"
                name="policies"
                className="settings-textarea"
                placeholder="Lorem ipsum adioanefone"
                value={formData.policies}
                onChange={handleInputChange}
              />
            </div>

            <div className="settings-form-group settings-form-group-full">
              <label htmlFor="about">About</label>
              {settings?.about && (
                <div className="settings-current-value">
                  <strong>Current Description:</strong>
                  <p>{settings.about}</p>
                </div>
              )}
              <textarea
                id="about"
                name="about"
                className="settings-textarea"
                placeholder="Enter company about description"
                value={formData.about}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>

            <div className="settings-contact-section">
              <h3>Contact Info</h3>
              <div className="settings-contact-grid">
                {formData.email && (
                  <div className="settings-contact-item">
                    <div className="settings-contact-icon">
                      <Mail />
                    </div>
                    <div className="settings-contact-details">
                      <strong>{formData.email}</strong>
                      <span>Primary</span>
                    </div>
                  </div>
                )}

                {formData.phone && (
                  <div className="settings-contact-item">
                    <div className="settings-contact-icon">
                      <Phone />
                    </div>
                    <div className="settings-contact-details">
                      <strong>{formData.phone}</strong>
                      <span>Primary</span>
                    </div>
                  </div>
                )}

                {settings?.additional_emails?.map((email, idx) => (
                  <div key={`email-${idx}`} className="settings-contact-item">
                    <div className="settings-contact-icon">
                      <Mail />
                    </div>
                    <div className="settings-contact-details">
                      <strong>{email}</strong>
                      <span>Additional</span>
                    </div>
                  </div>
                ))}

                {settings?.additional_phones?.map((phone, idx) => (
                  <div key={`phone-${idx}`} className="settings-contact-item">
                    <div className="settings-contact-icon">
                      <Phone />
                    </div>
                    <div className="settings-contact-details">
                      <strong>{phone}</strong>
                      <span>Additional</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="settings-contact-buttons">
                <div className="settings-contact-form">
                  <input
                    type="email"
                    className="settings-input"
                    placeholder="Add email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <button
                    className="settings-add-btn"
                    onClick={handleAddEmail}
                    type="button"
                  >
                    +Add Email
                  </button>
                </div>
                <div className="settings-contact-form">
                  <input
                    type="tel"
                    className="settings-input"
                    placeholder="Add phone number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                  <button
                    className="settings-add-btn"
                    onClick={handleAddPhone}
                    type="button"
                  >
                    +Add Phone
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Settings;

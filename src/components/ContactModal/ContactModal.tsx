import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import './ContactModal.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'general' | 'call' | 'property';
  propertyId?: number;
}

export const ContactModal: React.FC<ContactModalProps> = ({ 
  isOpen, 
  onClose, 
  type = 'general', 
  propertyId 
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
    preferred_date: '',
    preferred_time: '',
    property_id: propertyId || '',
    budget_min: '',
    budget_max: '',
    acknowledge: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      let endpoint = '';
      let payload = {};

      if (type === 'call') {
        endpoint = 'http://localhost:8000/api/leads/schedule-call/';
        payload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          message: formData.message
        };
      } else if (type === 'property') {
        endpoint = 'http://localhost:8000/api/leads/property-inquiry/';
        payload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          property_id: formData.property_id || propertyId,
          message: formData.message
        };
      } else {
        endpoint = 'http://localhost:8000/api/leads/contact/';
        payload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setStatusMessage(data.message);
        
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          message: '',
          preferred_date: '',
          preferred_time: '',
          property_id: propertyId || '',
          budget_min: '',
          budget_max: '',
          acknowledge: false
        });

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setStatusMessage('Failed to submit. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="contact-modal-header">
          <h2>
            <span className="header-black">Get In</span>{' '}
            <span className="header-gold">Touch</span>
          </h2>
          <button className="contact-modal-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-info-cards">
          <div className="info-card">
            <Phone size={20} />
            <span>+91 9026404xxx</span>
          </div>
          <div className="info-card">
            <Mail size={20} />
            <span>info@quorumproperty.com</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="contact-modal-body">
          <form onSubmit={handleSubmit} className="contact-modal-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name *"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name *"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {type === 'call' && (
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="date"
                    name="preferred_date"
                    placeholder="Preferred Date *"
                    value={formData.preferred_date}
                    onChange={handleChange}
                    min={getTodayDate()}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="time"
                    name="preferred_time"
                    placeholder="Preferred Time *"
                    value={formData.preferred_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <input
                  type="number"
                  name="budget_min"
                  placeholder="Budget Min (₹)"
                  value={formData.budget_min}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  name="budget_max"
                  placeholder="Budget Max (₹)"
                  value={formData.budget_max}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message (optional)"
                value={formData.message}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acknowledge"
                  checked={formData.acknowledge}
                  onChange={handleChange}
                  required
                />
                <span className="checkbox-text">
                  I acknowledge that my information will be used to contact me regarding my inquiry *
                </span>
              </label>
            </div>

            {submitStatus !== 'idle' && (
              <div className={`status-message ${submitStatus}`}>
                {submitStatus === 'success' ? (
                  <>
                    <CheckCircle size={18} />
                    <span>{statusMessage}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} />
                    <span>{statusMessage}</span>
                  </>
                )}
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send size={18} />
                  {type === 'call' ? 'Schedule Call' : 'Send Message'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import './CloseLeadForm.css';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
}

interface CloseLeadFormProps {
  leadId: number;
  firstName: string;
  lastName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CloseLeadForm: React.FC<CloseLeadFormProps> = ({
  leadId,
  firstName,
  lastName,
  onClose,
  onSuccess,
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    offer_amount: '',
    closing_amount: '',
    closing_date: '',
    deal_type: 'sale',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Try with authentication first
      let res = await fetch('http://localhost:8000/api/properties/list/', {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });

      // If unauthorized, try without token (API might allow public access)
      if (res.status === 401 && token) {
        res = await fetch('http://localhost:8000/api/properties/list/');
      }

      if (res.ok) {
        const data = await res.json();
        console.log('Properties API Response:', data);
        
        let propertiesArray: Property[] = [];
        
        // Handle different response formats
        if (Array.isArray(data)) {
          propertiesArray = data;
        } else if (data.results && Array.isArray(data.results)) {
          propertiesArray = data.results;
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          console.warn('Unexpected properties response format:', data);
        }
        
        if (propertiesArray.length === 0) {
          console.warn('No properties returned from API');
          setProperties([]);
          setLoading(false);
          return;
        }
        
        // Transform to match Property interface
        const transformedProperties = propertiesArray.map((prop: any) => ({
          id: prop.id || prop.pk,
          title: prop.title,
          location: prop.location || '',
          price: prop.price || '',
        }));
        
        setProperties(transformedProperties.slice(0, 20));
        console.log('Loaded properties:', transformedProperties);
      } else {
        console.error('Failed to fetch properties. Status:', res.status, 'Text:', res.statusText);
        const errorText = await res.text();
        console.error('Error response:', errorText);
        toast.error(`Failed to load properties (${res.status})`);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      toast.error('Failed to load properties - check console for details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.property_id) {
      toast.error('Please select a property');
      return false;
    }
    if (!formData.offer_amount) {
      toast.error('Please enter offer amount');
      return false;
    }
    if (!formData.closing_amount) {
      toast.error('Please enter closing amount');
      return false;
    }
    if (!formData.closing_date) {
      toast.error('Please select closing date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(
        `http://localhost:8000/api/leads/${leadId}/close-deal/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            property_id: parseInt(formData.property_id),
            offer_amount: parseFloat(formData.offer_amount),
            closing_amount: parseFloat(formData.closing_amount),
            closing_date: formData.closing_date,
            deal_type: formData.deal_type,
          }),
        }
      );

      if (res.ok) {
        toast.success('Deal closed successfully!');
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to close deal');
      }
    } catch (err) {
      console.error('Failed to close deal', err);
      toast.error('An error occurred while closing the deal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="close-lead-overlay" onClick={onClose}>
      <div className="close-lead-modal" onClick={(e) => e.stopPropagation()}>
        <div className="close-lead-header">
          <h2 className="close-lead-title">
            Close <span className="close-lead-highlight">Deal</span>
          </h2>
          <button
            className="close-lead-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="close-lead-loading">Loading properties...</div>
        ) : (
          <form className="close-lead-form" onSubmit={handleSubmit}>
            <div className="close-lead-section">
              <div className="close-lead-grid">
                <div className="close-lead-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    value={firstName}
                    disabled
                    className="close-lead-input-disabled"
                  />
                </div>

                <div className="close-lead-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    value={lastName}
                    disabled
                    className="close-lead-input-disabled"
                  />
                </div>

                <div className="close-lead-group close-lead-full-width">
                  <label htmlFor="property_id">Property to Close</label>
                  <select
                    id="property_id"
                    name="property_id"
                    value={formData.property_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a property...</option>
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.title} - {prop.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="close-lead-group">
                  <label htmlFor="deal_type">Deal Type</label>
                  <select
                    id="deal_type"
                    name="deal_type"
                    value={formData.deal_type}
                    onChange={handleInputChange}
                  >
                    <option value="sale">Sale</option>
                    <option value="rent">Rental</option>
                  </select>
                </div>

                <div className="close-lead-group">
                  <label htmlFor="offer_amount">Offer Amount</label>
                  <div className="close-lead-input-wrapper">
                    <span className="close-lead-currency">$</span>
                    <input
                      type="number"
                      id="offer_amount"
                      name="offer_amount"
                      value={formData.offer_amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="close-lead-group">
                  <label htmlFor="closing_amount">Closing Amount</label>
                  <div className="close-lead-input-wrapper">
                    <span className="close-lead-currency">$</span>
                    <input
                      type="number"
                      id="closing_amount"
                      name="closing_amount"
                      value={formData.closing_amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="close-lead-group close-lead-full-width">
                  <label htmlFor="closing_date">Closing Date</label>
                  <input
                    type="date"
                    id="closing_date"
                    name="closing_date"
                    value={formData.closing_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="close-lead-actions">
              <button
                type="button"
                className="close-lead-btn-cancel"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="close-lead-btn-submit"
                disabled={submitting}
              >
                {submitting ? 'Closing Deal...' : 'Close Deal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CloseLeadForm;

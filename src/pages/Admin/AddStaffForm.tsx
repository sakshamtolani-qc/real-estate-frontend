import React, { useState } from 'react';
import './AddStaffForm.css';

interface AddStaffFormProps {
  onStaffAdded: () => void;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onStaffAdded }) => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    status: 'Active',
    photo: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Get the auth token
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('You must be logged in to add staff');
      }
      
      // Prepare JSON data (photo upload can be added later if needed)
      const staffData = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        status: form.status
      };
      
      const res = await fetch('/api/accounts/add-staff/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(staffData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Handle specific error messages from backend
        if (data.email) {
          throw new Error(Array.isArray(data.email) ? data.email[0] : data.email);
        }
        if (data.phone) {
          throw new Error(Array.isArray(data.phone) ? data.phone[0] : data.phone);
        }
        if (data.detail) {
          throw new Error(data.detail);
        }
        throw new Error('Failed to add staff');
      }
      
      // Success!
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        status: 'Active',
        photo: null,
      });
      onStaffAdded();
    } catch (err: any) {
      setError(err.message || 'Error adding staff');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="add-staff-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Add Staff</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-content">
        <div className="form-fields">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input 
                name="first_name" 
                value={form.first_name} 
                onChange={handleChange} 
                placeholder="Enter first name"
                required 
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                name="last_name" 
                value={form.last_name} 
                onChange={handleChange} 
                placeholder="Enter last name"
                required 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="staff@example.com"
                required 
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                placeholder="+1 (555) 123-4567"
                required 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                placeholder="Enter secure password"
                required 
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="photo-upload">
          {form.photo ? (
            <img src={URL.createObjectURL(form.photo)} alt="Preview" className="photo-preview" />
          ) : (
            <div className="photo-preview">
              <div className="photo-placeholder">
                <svg className="photo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Staff Photo</span>
              </div>
            </div>
          )}
          <label className="photo-upload-label">
            <input 
              name="photo" 
              type="file" 
              accept="image/*" 
              onChange={handleChange} 
              className="photo-input"
            />
            <span className="photo-upload-text">Choose Photo</span>
          </label>
        </div>
      </div>
      
      <button className="submit-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Staff'}
      </button>
    </form>
  );
};

export default AddStaffForm;

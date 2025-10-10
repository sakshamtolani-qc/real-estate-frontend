import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'sonner';
import './Signup.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNo: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNo?: string;
  confirmPassword?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNo: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for backend API according to RegisterForm interface
      const registerData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phoneNo,
      };

      // Call register function from AuthContext (this will auto-login the user)
      await register(registerData);
      
      // Show success message
      toast.success('Account created successfully! Redirecting to properties...');
      
      // Redirect to properties page
      setTimeout(() => {
        navigate('/properties');
      }, 1500);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific error messages from backend
      if (error?.response?.data) {
        const errorData = error.response.data;
        const backendErrors: FormErrors = {};
        
        // Map backend errors to form fields
        if (errorData.email) {
          const emailError = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
          backendErrors.email = emailError;
          toast.error(emailError);
        }
        
        if (errorData.phone) {
          const phoneError = Array.isArray(errorData.phone) ? errorData.phone[0] : errorData.phone;
          backendErrors.phoneNo = phoneError;
          toast.error(phoneError);
        }
        
        if (errorData.password) {
          const passwordError = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
          backendErrors.password = passwordError;
          toast.error(passwordError);
        }
        
        if (errorData.first_name) {
          const firstNameError = Array.isArray(errorData.first_name) ? errorData.first_name[0] : errorData.first_name;
          backendErrors.firstName = firstNameError;
          toast.error(firstNameError);
        }
        
        if (errorData.last_name) {
          const lastNameError = Array.isArray(errorData.last_name) ? errorData.last_name[0] : errorData.last_name;
          backendErrors.lastName = lastNameError;
          toast.error(lastNameError);
        }
        
        // Set all backend errors to display inline
        if (Object.keys(backendErrors).length > 0) {
          setErrors(prev => ({ ...prev, ...backendErrors }));
        }
        
        // Show generic message if no specific field errors
        if (errorData.message && Object.keys(backendErrors).length === 0) {
          toast.error(errorData.message);
        } else if (Object.keys(backendErrors).length === 0) {
          toast.error('Signup failed. Please check your information and try again.');
        }
      } else {
        toast.error('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Left Column - Hero Section */}
       <div className="hero-section">
        <div className="login-logo-overlay">
          <img src="/logo.png" alt="Quorium Logo" className="login-logo" />
        </div>
        <div className="hero-background">
          <img src="/Bg-image.png" alt="Property buildings" className="hero-image" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Your Next<br />
            <span className="golden-text">Property</span>, Just a<br />
            <span className="golden-text">Click</span> Away.
          </h1>
        </div>
        </div>

      {/* Right Column - Signup Form */}
      <div className="signup-form-section">
        <div className="form-container">
          {/* Header */}
          <div className="form-header">
            <div className="login-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
              </svg>
            </div>
            <h2 className="form-title">SignUp</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phoneNo">Phone no.</label>
                <input
                  type="tel"
                  id="phoneNo"
                  name="phoneNo"
                  placeholder="Phone no."
                  value={formData.phoneNo}
                  onChange={handleInputChange}
                  className={errors.phoneNo ? 'error' : ''}
                />
                {errors.phoneNo && <span className="error-text">{errors.phoneNo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'SignUp'}
            </button>

            <div className="divider">
              <span>Or</span>
            </div>

            <div className="login-link">
              <span>Already have an account? </span>
              <Link to="/login">Login</Link>
            </div>

            <div className="home-link">
              <Link to="/" className="home-text">
                ← Go to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
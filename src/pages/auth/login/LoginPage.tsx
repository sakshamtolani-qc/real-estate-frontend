import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrPhone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // Mock login for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock JWT token (replace with actual token from API response)
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';
      localStorage.setItem('authToken', mockToken);
      
      // Redirect to dashboard or home page
      console.log('Login successful!');
      
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Hero Section with Background Image */}
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

      {/* Right Side - Login Form */}
      <div className="form-section">
        <div className="form-container">
          {/* Login Icon and Title */}
          <div className="form-header">
            <div className="login-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
              </svg>
            </div>
            <h2 className="form-title">Login</h2>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="input-group">
              <label htmlFor="emailOrPhone" className="input-label">
                Email/Phone no.
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                placeholder="Email/Phone no"
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="input-field"
                required
              />
            </div>

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div className="divider">
              <span>Or</span>
            </div>

            <div className="signup-link">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-text">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
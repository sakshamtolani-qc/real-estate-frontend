import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useSettings } from '../../../context/SettingsContext';
import { ButtonLoader } from '../../../components/common/Loader';
import { logger } from '../../../utils/logger';
import './LoginPage.css';

interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { settings } = useSettings();
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrPhone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in (but don't clear tokens - user might be re-visiting)
  useEffect(() => {
    if (user) {
      // Check user role and redirect accordingly
      if ((user as any).is_superuser) {
        // Admin goes to admin dashboard
        navigate('/dashboard', { replace: true });
      } else if ((user as any).is_employee) {
        // Agent/Staff goes to agent dashboard
        navigate('/agent/dashboard', { replace: true });
      } else {
        // Regular customer goes to properties
        navigate('/properties', { replace: true });
      }
    }
  }, [user, navigate]);

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
      await login({
        email: formData.emailOrPhone,
        password: formData.password
      });
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      logger.error('Login error:', error);
      setError(error?.message || 'Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Hero Section with Background Image */}
      <div className="hero-section">
        <div className="login-logo-overlay">
          <div className="logo-with-name">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Company Logo" className="login-logo" />
            ) : (
              <img src="/logo.png" alt="Quorium Logo" className="login-logo" />
            )}
            <div className="logo-company-name">
              <div className="logo-name-large">{settings?.company_name?.split(' ')[0] || 'Quorium'}</div>
              <div className="logo-name-small">{settings?.company_name?.split(' ').slice(1).join(' ') || 'Property'}</div>
            </div>
          </div>
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
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="input-field"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isLoading ? (
              <ButtonLoader text="Logging in..." fullWidth={true} size="md" variant="primary" />
            ) : (
              <button 
                type="submit" 
                className="login-button"
              >
                Login
              </button>
            )}

            <div className="divider">
              <span>Or</span>
            </div>

            <div className="signup-link">
              Don't have an account?{' '}
              <Link to="/signup" className="signup-text">
                Sign Up
              </Link>
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

export default Login;
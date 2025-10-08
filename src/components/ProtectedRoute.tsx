import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'agent' | 'customer')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to signup page
  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  // Check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    // Derive role from user flags
    let userRole: 'admin' | 'agent' | 'customer';
    
    if (user.is_superuser) {
      userRole = 'admin';
    } else if (user.is_employee) {
      userRole = 'agent';
    } else {
      userRole = 'customer';
    }
    
    // Also check the role field if it exists (for backward compatibility)
    const effectiveRole = user.role || userRole;
    
    if (!allowedRoles.includes(effectiveRole)) {
      // User doesn't have permission, redirect to unauthorized page or dashboard
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#d32f2f'
        }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>Your role: {effectiveRole}</p>
          <a href="/dashboard" style={{ marginTop: '20px', color: '#1976d2', textDecoration: 'none' }}>Go to Dashboard</a>
        </div>
      );
    }
  }

  // User is authenticated and authorized, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;

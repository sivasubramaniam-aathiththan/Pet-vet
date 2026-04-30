import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar Component
 * 
 * Displays navigation links based on user role
 * Professional styled navigation bar
 */
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-icon">🐾</span>
        <span>PetCare</span>
      </Link>
      
      <div className="navbar-links">
        {/* Common Links */}
        <Link to="/dashboard">
          <span>📊</span> Dashboard
        </Link>
        
        {/* User Links */}
        {user?.role === 'USER' && (
          <>
            <Link to="/appointments">
              <span>📅</span> Appointments
            </Link>
            <Link to="/expenses">
              <span>💰</span> Expenses
            </Link>
            <Link to="/adoption">
              <span>🏠</span> Adoption
            </Link>
            <Link to="/trainers">
              <span>🎓</span> Trainers
            </Link>
            <Link to="/products">
              <span>🛒</span> Products
            </Link>
            <Link to="/cart">
              <span>🛒</span> Cart
            </Link>
            <Link to="/orders">
              <span>📋</span> Orders
            </Link>
          </>
        )}
        
        {/* Admin Links - visible to ADMIN and DOCTOR roles */}
        {(user?.role === 'ADMIN' || user?.role === 'DOCTOR') && (
          <>
            <Link to="/admin/users">
              <span>👥</span> Users
            </Link>
            <Link to="/admin/doctors">
              <span>👨‍⚕️</span> Doctors
            </Link>
            <Link to="/admin/trainers">
              <span>🎓</span> Trainers
            </Link>
          </>
        )}
        
        {/* Admin Products & Orders - only for ADMIN */}
        {user?.role === 'ADMIN' && (
          <>
            <Link to="/admin/adoption">
              <span>🏠</span> Adoption
            </Link>
            <Link to="/admin/products">
              <span>📦</span> Products
            </Link>
            <Link to="/admin/orders">
              <span>📦</span> Orders
            </Link>
          </>
        )}
        
        {/* Doctor Links */}
        {user?.role === 'DOCTOR' && (
          <>
            <Link to="/doctor/appointments">
              <span>📅</span> My Appointments
            </Link>
          </>
        )}
        
        {/* Trainer Links */}
        {user?.role === 'TRAINER' && (
          <>
            <Link to="/trainer/packages">
              <span>📦</span> My Packages
            </Link>
          </>
        )}
      </div>
      
      <div className="navbar-user">
        <div className="navbar-user-info">
          <span className="navbar-user-name">{user?.firstName} {user?.lastName}</span>
          <span className="navbar-user-role">{user?.role}</span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

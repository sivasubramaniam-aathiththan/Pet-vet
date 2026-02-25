import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar Component
 * 
 * Displays navigation links based on user role
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
        🐾 Pet Management
      </Link>
      
      <div className="navbar-links">
        {/* Common Links */}
        <Link to="/dashboard">Dashboard</Link>
        
        {/* User Links */}
        {user?.role === 'USER' && (
          <>
            <Link to="/pets">My Pets</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/vaccinations">Vaccinations</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/adoption">Adoption</Link>
            <Link to="/trainers">Trainers</Link>
            <Link to="/products">Products</Link>
          </>
        )}
        
        {/* Admin Links */}
        {user?.role === 'ADMIN' && (
          <>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/doctors">Doctors</Link>
            <Link to="/admin/trainers">Trainers</Link>
            <Link to="/admin/adoption">Adoption Posts</Link>
            <Link to="/admin/products">Products</Link>
          </>
        )}
        
        {/* Doctor Links */}
        {user?.role === 'DOCTOR' && (
          <>
            <Link to="/doctor/appointments">My Appointments</Link>
          </>
        )}
        
        {/* Trainer Links */}
        {user?.role === 'TRAINER' && (
          <>
            <Link to="/trainer/packages">My Packages</Link>
          </>
        )}
      </div>
      
      <div className="navbar-user">
        <span>Welcome, {user?.firstName} ({user?.role})</span>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

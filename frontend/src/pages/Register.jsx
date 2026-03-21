import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Register Page
 * 
 * Handles user registration with professional styling
 */
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-scaleIn" style={{ maxWidth: '540px' }}>
        <div className="auth-header">
          <div className="auth-logo">🐾</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join PetCare and manage your pets with ease.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="form-section">
            <h3 className="form-section-title">👤 Personal Information</h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label form-label-required">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label form-label-required">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
                {errors.lastName && <span className="form-error">{errors.lastName}</span>}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="form-section">
            <h3 className="form-section-title">🔐 Account Information</h3>
            <div className="form-group">
              <label className="form-label form-label-required">Username</label>
              <input
                type="text"
                name="username"
                className={`form-input ${errors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
              />
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label form-label-required">Email</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label form-label-required">Password</label>
                <input
                  type="password"
                  name="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label form-label-required">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3 className="form-section-title">📞 Contact Information</h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="form-input"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                />
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : '🚀 Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

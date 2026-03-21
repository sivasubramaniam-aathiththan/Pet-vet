import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    specialization: '',
    availability: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDoctors();
      setDoctors(response.data.data);
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const data = {
        ...formData,
        role: 'DOCTOR'
      };
      
      await userAPI.createStaff(data);
      alert('Doctor added successfully!');
      setShowModal(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        specialization: '',
        availability: ''
      });
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
      await userAPI.deleteUser(doctorId);
      setDoctors(doctors.filter(d => d.userId !== doctorId));
      alert('Doctor deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const handleToggleStatus = async (doctorId) => {
    try {
      const response = await userAPI.toggleStatus(doctorId);
      setDoctors(doctors.map(d => d.userId === doctorId ? response.data.data : d));
      alert('Doctor status updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update doctor status');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="header-content">
            <div>
              <h2 className="card-title">👨‍⚕️ Doctor Management</h2>
              <p className="text-muted">Manage doctors in the system</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              ➕ Add Doctor
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No doctors found</td>
                </tr>
              ) : (
                doctors.map(doctor => (
                  <tr key={doctor.userId}>
                    <td>{doctor.userId}</td>
                    <td>
                      <div className="user-info">
                        <strong>{doctor.firstName} {doctor.lastName}</strong>
                        <small>@{doctor.username}</small>
                      </div>
                    </td>
                    <td>{doctor.email}</td>
                    <td>{doctor.phoneNumber || '-'}</td>
                    <td>{doctor.specialization || '-'}</td>
                    <td>{doctor.availability || '-'}</td>
                    <td>
                      <span className={`badge ${doctor.enabled ? 'badge-success' : 'badge-danger'}`}>
                        {doctor.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleToggleStatus(doctor.userId)}
                          className="btn btn-sm btn-secondary"
                          title={doctor.enabled ? 'Disable' : 'Enable'}
                        >
                          {doctor.enabled ? '🔴' : '🟢'}
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.userId)}
                          className="btn btn-sm btn-danger"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="stats">
          <p>Total Doctors: {doctors.length}</p>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add New Doctor</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Specialization *</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., General Medicine, Surgery"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Availability</label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      placeholder="e.g., Mon-Fri 9AM-5PM"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDoctors;

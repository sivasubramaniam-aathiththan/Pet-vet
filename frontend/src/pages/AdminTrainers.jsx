import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

function AdminTrainers() {
  const [trainers, setTrainers] = useState([]);
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
    expertise: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getTrainers();
      setTrainers(response.data.data);
    } catch (err) {
      setError('Failed to fetch trainers');
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
        role: 'TRAINER'
      };
      
      await userAPI.createStaff(data);
      alert('Trainer added successfully!');
      setShowModal(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        expertise: ''
      });
      fetchTrainers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add trainer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (trainerId) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;
    
    try {
      await userAPI.deleteUser(trainerId);
      setTrainers(trainers.filter(t => t.userId !== trainerId));
      alert('Trainer deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete trainer');
    }
  };

  const handleToggleStatus = async (trainerId) => {
    try {
      const response = await userAPI.toggleStatus(trainerId);
      setTrainers(trainers.map(t => t.userId === trainerId ? response.data.data : t));
      alert('Trainer status updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update trainer status');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading trainers...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="header-content">
            <div>
              <h2 className="card-title">🎓 Trainer Management</h2>
              <p className="text-muted">Manage trainers in the system</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              ➕ Add Trainer
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
                <th>Expertise</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No trainers found</td>
                </tr>
              ) : (
                trainers.map(trainer => (
                  <tr key={trainer.userId}>
                    <td>{trainer.userId}</td>
                    <td>
                      <div className="user-info">
                        <strong>{trainer.firstName} {trainer.lastName}</strong>
                        <small>@{trainer.username}</small>
                      </div>
                    </td>
                    <td>{trainer.email}</td>
                    <td>{trainer.phoneNumber || '-'}</td>
                    <td>{trainer.expertise || '-'}</td>
                    <td>
                      <span className={`badge ${trainer.enabled ? 'badge-success' : 'badge-danger'}`}>
                        {trainer.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleToggleStatus(trainer.userId)}
                          className="btn btn-sm btn-secondary"
                          title={trainer.enabled ? 'Disable' : 'Enable'}
                        >
                          {trainer.enabled ? '🔴' : '🟢'}
                        </button>
                        <button
                          onClick={() => handleDelete(trainer.userId)}
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
          <p>Total Trainers: {trainers.length}</p>
        </div>
      </div>

      {/* Add Trainer Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add New Trainer</h3>
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
                  <div className="form-group full-width">
                    <label>Expertise *</label>
                    <input
                      type="text"
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Obedience Training, Agility, Behavior Modification"
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
                  {submitting ? 'Adding...' : 'Add Trainer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTrainers;

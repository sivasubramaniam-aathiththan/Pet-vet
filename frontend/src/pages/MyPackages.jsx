import { useEffect, useState } from 'react';
import { trainerPackageAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * My Packages Page (Trainer View)
 * 
 * Allows trainers to:
 * - View their packages
 * - Add new packages
 * - Edit existing packages
 * - Delete packages
 * - Toggle package status (active/inactive)
 */
const MyPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    packageName: '',
    trainingType: '',
    petType: '',
    duration: '',
    price: '',
    description: '',
    mobileNumber: ''
  });

  const trainingTypes = ['OBEDIENCE', 'AGILITY', 'BEHAVIORAL', 'BASIC', 'ADVANCED', 'SPECIALIZED'];
  const petTypes = ['DOG', 'CAT', 'BIRD', 'ALL'];

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await trainerPackageAPI.getMyPackages();
      setPackages(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load packages');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const packageData = {
        packageName: formData.packageName,
        trainingType: formData.trainingType,
        petType: formData.petType,
        duration: formData.duration,
        price: parseFloat(formData.price),
        description: formData.description,
        mobileNumber: formData.mobileNumber
      };

      if (editingPackage) {
        await trainerPackageAPI.update(editingPackage.packageId, packageData);
        toast.success('Package updated successfully!');
      } else {
        await trainerPackageAPI.create(packageData);
        toast.success('Package created successfully!');
      }

      resetForm();
      setShowModal(false);
      fetchPackages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save package');
      console.error('Error:', error);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      packageName: pkg.packageName || '',
      trainingType: pkg.trainingType || '',
      petType: pkg.petType || '',
      duration: pkg.duration || '',
      price: pkg.price || '',
      description: pkg.description || '',
      mobileNumber: pkg.mobileNumber || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (packageId) => {
    if (!window.confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      await trainerPackageAPI.delete(packageId);
      toast.success('Package deleted successfully!');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to delete package');
      console.error('Error:', error);
    }
  };

  const handleToggleStatus = async (packageId) => {
    try {
      await trainerPackageAPI.toggleStatus(packageId);
      toast.success('Package status updated!');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      packageName: '',
      trainingType: '',
      petType: '',
      duration: '',
      price: '',
      description: '',
      mobileNumber: ''
    });
    setEditingPackage(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>My Training Packages</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Manage your training packages and offerings
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add New Package
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{packages.length}</div>
          <div className="stat-label">Total Packages</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-icon">✅</div>
          <div className="stat-value">
            {packages.filter(p => p.isActive).length}
          </div>
          <div className="stat-label">Active Packages</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⏸️</div>
          <div className="stat-value">
            {packages.filter(p => !p.isActive).length}
          </div>
          <div className="stat-label">Inactive Packages</div>
        </div>
      </div>

      {/* Packages List */}
      <div className="card">
        <h3 className="card-header">📋 My Packages</h3>
        
        {packages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No packages yet.</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Create Your First Package
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.packageId}>
                    <td><strong>{pkg.packageName}</strong></td>
                    <td>
                      <span className="category-badge">
                        {pkg.trainingType}
                      </span>
                    </td>
                    <td>{pkg.duration}</td>
                    <td className="amount-cell">{formatCurrency(pkg.price)}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${pkg.isActive ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => handleToggleStatus(pkg.packageId)}
                      >
                        {pkg.isActive ? '✅ Active' : '⏸️ Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(pkg)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(pkg.packageId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Package Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPackage ? 'Edit Package' : 'Add New Package'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="packageName">Package Name *</label>
                <input
                  type="text"
                  id="packageName"
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Basic Obedience Training"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="trainingType">Training Type *</label>
                  <select
                    id="trainingType"
                    name="trainingType"
                    value={formData.trainingType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
                    {trainingTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="petType">Pet Type</label>
                  <select
                    id="petType"
                    name="petType"
                    value={formData.petType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select pet type</option>
                    {petTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="duration">Duration *</label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 4 weeks, 8 sessions"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price (LKR) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="e.g., 15000.00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe what this package includes..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., +94771234567"
                />
                <small style={{ color: '#666' }}>Customers can contact you through this number</small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPackages;

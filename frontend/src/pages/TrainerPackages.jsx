import { useEffect, useState } from 'react';
import { trainerPackageAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Trainer Packages Page (User View)
 * 
 * Allows users to:
 * - View all active trainer packages
 * - See package details (duration, price, description)
 * - Contact trainers
 */
const TrainerPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await trainerPackageAPI.getActive();
      setPackages(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load trainer packages');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const categories = ['ALL', 'BASIC', 'OBEDIENCE', 'AGILITY', 'BEHAVIORAL', 'ADVANCED'];

  const filteredPackages = selectedCategory === 'ALL'
    ? packages
    : packages.filter(pkg => pkg.packageType === selectedCategory);

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading trainer packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Training Packages</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Professional training packages for your pets
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">🎓</div>
          <div className="stat-value">{packages.length}</div>
          <div className="stat-label">Available Packages</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-value">
            {new Set(packages.map(p => p.trainerId)).size}
          </div>
          <div className="stat-label">Active Trainers</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: '500' }}>Filter by Category:</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No Packages Available</h3>
          <p style={{ color: '#999' }}>
            {selectedCategory === 'ALL' 
              ? 'No training packages are currently available.' 
              : `No packages in ${selectedCategory} category.`}
          </p>
        </div>
      ) : (
        <div className="packages-grid">
          {filteredPackages.map((pkg) => (
            <div key={pkg.packageId} className="package-card">
              <div className="package-header">
                <div className="package-icon">🎓</div>
                <div>
                  <h3>{pkg.packageName}</h3>
                  <p className="package-type">{pkg.packageType}</p>
                </div>
              </div>

              <div className="package-trainer">
                <span className="trainer-badge">
                  👨‍🏫 {pkg.trainerName}
                </span>
              </div>

              <div className="package-details">
                <div className="package-detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span><strong>Duration:</strong> {pkg.duration}</span>
                </div>
                <div className="package-detail-item">
                  <span className="detail-icon">💰</span>
                  <span><strong>Price:</strong> {formatCurrency(pkg.price)}</span>
                </div>
              </div>

              {pkg.description && (
                <div className="package-description">
                  <p>{pkg.description}</p>
                </div>
              )}

              <div className="package-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    toast.info(`Contact trainer: ${pkg.trainerName}`);
                    // You can add contact functionality here
                  }}
                >
                  Contact Trainer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerPackages;

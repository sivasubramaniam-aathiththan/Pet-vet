import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { vaccinationAPI, petAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * Vaccinations Page
 * 
 * Allows users to:
 * - View all vaccinations for their pets
 * - Add new vaccination records
 * - Edit existing vaccinations
 * - Delete vaccinations
 * - See upcoming/overdue vaccinations
 * 
 * Displays in a todo-list style with visual status indicators.
 */
const Vaccinations = () => {
  const [pets, setPets] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [dueSoon, setDueSoon] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState(null);
  const { user } = useAuth();
  const [selectedPet, setSelectedPet] = useState('ALL');
  const location = useLocation();
  const [formData, setFormData] = useState({
    petId: '',
    vaccineName: '',
    vaccinationDate: '',
    nextVaccinationDate: '',
    notes: ''
  });

  useEffect(() => {
    // if petId query param present, preselect it
    const params = new URLSearchParams(location.search);
    const pid = params.get('petId');
    if (pid) setSelectedPet(pid);
    fetchData();
  }, [location.search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsRes, vaccinationsRes, dueSoonRes, overdueRes] = await Promise.all([
        petAPI.getAll(),
        vaccinationAPI.getAll(),
        vaccinationAPI.getDueSoon(),
        vaccinationAPI.getOverdue()
      ]);

      setPets(petsRes.data.data || []);
      setVaccinations(vaccinationsRes.data.data || []);
      setDueSoon(dueSoonRes.data.data || []);
      setOverdue(overdueRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load vaccinations');
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
      const vaccinationData = {
        petId: parseInt(formData.petId),
        vaccineName: formData.vaccineName,
        vaccinationDate: formData.vaccinationDate,
        nextVaccinationDate: formData.nextVaccinationDate,
        notes: formData.notes
      };

      if (editingVaccination) {
        await vaccinationAPI.update(editingVaccination.vaccinationId, vaccinationData);
        toast.success('Vaccination updated successfully!');
      } else {
        await vaccinationAPI.create(vaccinationData);
        toast.success('Vaccination added successfully!');
      }

      resetForm();
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save vaccination');
      console.error('Error:', error);
    }
  };

  const handleEdit = (vaccination) => {
    setEditingVaccination(vaccination);
    setFormData({
      petId: vaccination.petId || '',
      vaccineName: vaccination.vaccineName || '',
      vaccinationDate: vaccination.vaccinationDate || '',
      nextVaccinationDate: vaccination.nextVaccinationDate || '',
      notes: vaccination.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (vaccinationId) => {
    if (!window.confirm('Are you sure you want to delete this vaccination record?')) {
      return;
    }

    try {
      await vaccinationAPI.delete(vaccinationId);
      toast.success('Vaccination deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete vaccination');
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      petId: '',
      vaccineName: '',
      vaccinationDate: '',
      nextVaccinationDate: '',
      notes: ''
    });
    setEditingVaccination(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVaccinationStatus = (nextDate) => {
    const days = getDaysUntil(nextDate);
    if (days === null) return { text: 'No next date', color: '#6c757d', bg: '#f8f9fa', icon: '❓' };
    if (days < 0) return { text: `Overdue by ${Math.abs(days)} days`, color: '#dc3545', bg: '#f8d7da', icon: '⚠️' };
    if (days <= 7) return { text: `Due in ${days} days`, color: '#dc3545', bg: '#f8d7da', icon: '🚨' };
    if (days <= 30) return { text: `Due in ${days} days`, color: '#ffc107', bg: '#fff3cd', icon: '⏰' };
    return { text: `Due in ${days} days`, color: '#28a745', bg: '#d4edda', icon: '✅' };
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.petId === petId);
    return pet ? pet.petName : 'Unknown Pet';
  };

  const filteredVaccinations = selectedPet === 'ALL' 
    ? vaccinations 
    : vaccinations.filter(v => v.petId === parseInt(selectedPet));

  // Sort by status (overdue first, then due soon, then others)
  const sortedVaccinations = [...filteredVaccinations].sort((a, b) => {
    const daysA = getDaysUntil(a.nextVaccinationDate) ?? 999;
    const daysB = getDaysUntil(b.nextVaccinationDate) ?? 999;
    return daysA - daysB;
  });

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading vaccinations...</p>
        </div>
      </div>
    );
  }

  // Stats
  const overdueCount = filteredVaccinations.filter(v => getDaysUntil(v.nextVaccinationDate) < 0).length;
  const dueSoonCount = filteredVaccinations.filter(v => {
    const days = getDaysUntil(v.nextVaccinationDate);
    return days !== null && days >= 0 && days <= 30;
  }).length;
  const upcomingCount = filteredVaccinations.filter(v => {
    const days = getDaysUntil(v.nextVaccinationDate);
    return days !== null && days > 30;
  }).length;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Vaccination Records</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Track and manage your pets' vaccination schedules
          </p>
        </div>
        {user?.role === 'DOCTOR' && (
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Vaccination
          </button>
        )}
      </div>

      {/* Summary Cards - Todo List Style */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">💉</div>
          <div className="stat-value">{filteredVaccinations.length}</div>
          <div className="stat-label">Total Vaccinations</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#f8d7da', border: '2px solid #dc3545' }}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{overdueCount}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#fff3cd', border: '2px solid #ffc107' }}>
          <div className="stat-icon">⏰</div>
          <div className="stat-value">{dueSoonCount}</div>
          <div className="stat-label">Due Soon (30 days)</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#d4edda', border: '2px solid #28a745' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-value">{upcomingCount}</div>
          <div className="stat-label">Upcoming</div>
        </div>
      </div>

      {/* Alerts */}
      {overdueCount > 0 && (
        <div className="alert alert-danger">
          <strong>⚠️ Overdue Vaccinations!</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            You have {overdueCount} overdue vaccination(s). Please schedule appointments soon.
          </p>
        </div>
      )}

      {dueSoonCount > 0 && overdueCount === 0 && (
        <div className="alert alert-warning">
          <strong>⏰ Upcoming Vaccinations</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            You have {dueSoonCount} vaccination(s) due within the next 30 days.
          </p>
        </div>
      )}

      {/* Filter by Pet */}
      {pets.length > 1 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ fontWeight: '500' }}>Filter by Pet:</label>
            <select 
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Pets</option>
              {pets.map(pet => (
                <option key={pet.petId} value={pet.petId}>
                  {pet.petName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Todo List View */}
      <div className="card">
        <h3 className="card-header">📋 Vaccination Tasks</h3>
        
        {sortedVaccinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No vaccination records yet.</p>
            {pets.length === 0 ? (
              <div>
                <p style={{ color: '#999', marginTop: '1rem' }}>
                  You need to add a pet first before tracking vaccinations.
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => window.location.href = '/pets'}
                  style={{ marginTop: '1rem' }}
                >
                  Add Your First Pet
                </button>
              </div>
            ) : (
              user?.role === 'DOCTOR' && (
                <button className="btn btn-primary" onClick={openAddModal}>
                  Add First Vaccination
                </button>
              )
            )}
          </div>
        ) : (
          <div className="todo-list">
            {sortedVaccinations.map((vaccination) => {
              const status = getVaccinationStatus(vaccination.nextVaccinationDate);
              const daysUntil = getDaysUntil(vaccination.nextVaccinationDate);
              
              return (
                <div 
                  key={vaccination.vaccinationId}
                  className="todo-item"
                  style={{ 
                    borderLeftColor: status.color,
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderLeftWidth: '4px',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span 
                        style={{
                          backgroundColor: status.bg,
                          color: status.color,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      >
                        {status.icon} {status.text}
                      </span>
                      <strong style={{ fontSize: '1.1rem' }}>{vaccination.vaccineName}</strong>
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span>🐾 {getPetName(vaccination.petId)}</span>
                      <span>📅 Last: {formatDate(vaccination.vaccinationDate)}</span>
                      {vaccination.nextVaccinationDate && (
                        <span>
                          📅 Next: {formatDate(vaccination.nextVaccinationDate)}
                          {daysUntil !== null && daysUntil < 0 && (
                            <span style={{ color: '#dc3545', fontWeight: 'bold', marginLeft: '0.5rem' }}>
                              (OVERDUE!)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    {vaccination.notes && (
                      <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                        📝 {vaccination.notes}
                      </div>
                    )}
                  </div>
                  
                  {user?.role === 'DOCTOR' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={() => handleEdit(vaccination)}
                        style={{ padding: '0.4rem 0.75rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDelete(vaccination.vaccinationId)}
                        style={{ padding: '0.4rem 0.75rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Vaccination Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingVaccination ? 'Edit Vaccination' : 'Add New Vaccination'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Vaccination Information */}
              <div className="form-section">
                <h3 className="form-section-title">💉 Vaccination Information</h3>

                <div className="form-group">
                  <label htmlFor="petId">Select Pet *</label>
                  <select
                    id="petId"
                    name="petId"
                    value={formData.petId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose a pet</option>
                    {pets.map(pet => (
                      <option key={pet.petId} value={pet.petId}>
                        {pet.petName} ({pet.breed})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="vaccineName">Vaccine Name *</label>
                  <input
                    type="text"
                    id="vaccineName"
                    name="vaccineName"
                    value={formData.vaccineName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Rabies, Distemper, Parvovirus"
                  />
                </div>
              </div>

              {/* Vaccination Schedule */}
              <div className="form-section">
                <h3 className="form-section-title">📅 Vaccination Schedule</h3>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="vaccinationDate">Vaccination Date *</label>
                    <input
                      type="date"
                      id="vaccinationDate"
                      name="vaccinationDate"
                      value={formData.vaccinationDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nextVaccinationDate">Next Due Date *</label>
                    <input
                      type="date"
                      id="nextVaccinationDate"
                      name="nextVaccinationDate"
                      value={formData.nextVaccinationDate}
                      onChange={handleInputChange}
                      required
                      min={formData.vaccinationDate}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="form-section">
                <h3 className="form-section-title">📝 Additional Information</h3>
                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any additional information about this vaccination..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVaccination ? 'Update Vaccination' : 'Add Vaccination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaccinations;

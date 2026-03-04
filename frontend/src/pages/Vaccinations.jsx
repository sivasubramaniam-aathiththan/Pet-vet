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
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVaccinationStatus = (nextDate) => {
    const days = getDaysUntil(nextDate);
    if (days === null) return { text: 'No next date', color: '#999' };
    if (days < 0) return { text: `Overdue by ${Math.abs(days)} days`, color: '#dc3545' };
    if (days <= 30) return { text: `Due in ${days} days`, color: '#ffc107' };
    return { text: `Due in ${days} days`, color: '#28a745' };
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.petId === petId);
    return pet ? pet.petName : 'Unknown Pet';
  };

  const filteredVaccinations = selectedPet === 'ALL' 
    ? vaccinations 
    : vaccinations.filter(v => v.petId === parseInt(selectedPet));

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

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">💉</div>
          <div className="stat-value">{vaccinations.length}</div>
          <div className="stat-label">Total Vaccinations</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⏰</div>
          <div className="stat-value">{dueSoon.length}</div>
          <div className="stat-label">Due Soon (30 days)</div>
        </div>
        <div className="stat-card stat-card-danger">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{overdue.length}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      {/* Alerts */}
      {overdue.length > 0 && (
        <div className="alert alert-danger">
          <strong>⚠️ Overdue Vaccinations!</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            You have {overdue.length} overdue vaccination(s). Please schedule appointments soon.
          </p>
        </div>
      )}

      {dueSoon.length > 0 && overdue.length === 0 && (
        <div className="alert alert-warning">
          <strong>⏰ Upcoming Vaccinations</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            You have {dueSoon.length} vaccination(s) due within the next 30 days.
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

      {/* Vaccinations List */}
      <div className="card">
        <h3 className="card-header">📋 Vaccination Records</h3>
        
        {filteredVaccinations.length === 0 ? (
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
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Vaccine Name</th>
                  <th>Vaccination Date</th>
                  <th>Next Due Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVaccinations.map((vaccination) => {
                  const status = getVaccinationStatus(vaccination.nextVaccinationDate);
                  return (
                    <tr key={vaccination.vaccinationId}>
                      <td><strong>{getPetName(vaccination.petId)}</strong></td>
                      <td>{vaccination.vaccineName}</td>
                      <td>{formatDate(vaccination.vaccinationDate)}</td>
                      <td>{formatDate(vaccination.nextVaccinationDate)}</td>
                      <td>
                        <span 
                          style={{
                            color: status.color,
                            fontWeight: '600',
                            fontSize: '0.9rem'
                          }}
                        >
                          {status.text}
                        </span>
                      </td>
                      <td>{vaccination.notes || '-'}</td>
                      <td>
                        {user?.role === 'DOCTOR' ? (
                          <div className="action-buttons">
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleEdit(vaccination)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(vaccination.vaccinationId)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#666' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

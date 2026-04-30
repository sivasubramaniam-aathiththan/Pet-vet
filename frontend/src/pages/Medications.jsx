import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { medicationAPI, petAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * Medication Reports Page
 *
 * Doctors can create, edit, and delete medication reports for any pet.
 * Regular users may view reports for their own pets but cannot modify them.
 * 
 * Displays medications in a todo-list style with status indicators.
 */
const Medications = () => {
  const [pets, setPets] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [selectedPet, setSelectedPet] = useState('ALL');
  const location = useLocation();
  const [formData, setFormData] = useState({
    petId: '',
    medicationName: '',
    dosage: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pid = params.get('petId');
    if (pid) setSelectedPet(pid);
    fetchData();
  }, [location.search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsRes, reportsRes] = await Promise.all([
        petAPI.getAll(),
        medicationAPI.getAll()
      ]);
      setPets(petsRes.data.data || []);
      setReports(reportsRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load medication reports');
      console.error(error);
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

    try {
      const data = {
        petId: parseInt(formData.petId),
        medicationName: formData.medicationName,
        dosage: formData.dosage,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes
      };

      if (editingReport) {
        await medicationAPI.update(editingReport.reportId, data);
        toast.success('Report updated');
      } else {
        await medicationAPI.create(data);
        toast.success('Report added');
      }

      resetForm();
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save report');
      console.error(error);
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      petId: report.petId || '',
      medicationName: report.medicationName || '',
      dosage: report.dosage || '',
      startDate: report.startDate || '',
      endDate: report.endDate || '',
      notes: report.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await medicationAPI.delete(id);
      toast.success('Report deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete report');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      petId: '',
      medicationName: '',
      dosage: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
    setEditingReport(null);
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.petId === petId);
    return pet ? pet.petName : 'Unknown';
  };

  const getPetInfo = (petId) => {
    return pets.find(p => p.petId === petId);
  };

  // Get medication status based on dates
  const getMedicationStatus = (report) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = report.startDate ? new Date(report.startDate) : null;
    const endDate = report.endDate ? new Date(report.endDate) : null;
    
    if (!startDate) return { text: 'Not Started', color: '#6c757d', bg: '#f8f9fa' };
    
    if (endDate && endDate < today) {
      return { text: 'Completed', color: '#28a745', bg: '#d4edda' };
    }
    
    if (startDate <= today && (!endDate || endDate >= today)) {
      return { text: 'Active', color: '#007bff', bg: '#cce5ff' };
    }
    
    if (startDate > today) {
      return { text: 'Upcoming', color: '#ffc107', bg: '#fff3cd' };
    }
    
    return { text: 'Active', color: '#007bff', bg: '#cce5ff' };
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filtered = selectedPet === 'ALL'
    ? reports
    : reports.filter(r => r.petId === parseInt(selectedPet));

  // Sort by status (Active first, then upcoming, then completed)
  const sortedReports = [...filtered].sort((a, b) => {
    const statusA = getMedicationStatus(a).text;
    const statusB = getMedicationStatus(b).text;
    const order = { 'Active': 0, 'Upcoming': 1, 'Not Started': 2, 'Completed': 3 };
    return (order[statusA] || 4) - (order[statusB] || 4);
  });

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  // Active medications count
  const activeCount = filtered.filter(r => getMedicationStatus(r).text === 'Active').length;
  const upcomingCount = filtered.filter(r => getMedicationStatus(r).text === 'Upcoming').length;
  const completedCount = filtered.filter(r => getMedicationStatus(r).text === 'Completed').length;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Medication Reports</h1>
        {user?.role === 'DOCTOR' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Medication
          </button>
        )}
      </div>

      {/* Summary Cards - Todo List Style */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">💊</div>
          <div className="stat-value">{filtered.length}</div>
          <div className="stat-label">Total Medications</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#cce5ff', border: '2px solid #007bff' }}>
          <div className="stat-icon">▶️</div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">Active Treatments</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#fff3cd', border: '2px solid #ffc107' }}>
          <div className="stat-icon">⏰</div>
          <div className="stat-value">{upcomingCount}</div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#d4edda', border: '2px solid #28a745' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Filter */}
      <div className="filters">
        <select value={selectedPet} onChange={e => setSelectedPet(e.target.value)}>
          <option value="ALL">All pets</option>
          {pets.map(p => (
            <option key={p.petId} value={p.petId}>{p.petName}</option>
          ))}
        </select>
      </div>

      {/* Todo List View */}
      <div className="card">
        <h3 className="card-header">📋 Medication Tasks</h3>
        
        {sortedReports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No medication reports yet.</p>
            {user?.role === 'DOCTOR' && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Add First Medication
              </button>
            )}
          </div>
        ) : (
          <div className="todo-list">
            {sortedReports.map((report) => {
              const status = getMedicationStatus(report);
              const daysRemaining = getDaysRemaining(report.endDate);
              const petInfo = getPetInfo(report.petId);
              
              return (
                <div 
                  key={report.reportId} 
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
                        {status.text}
                      </span>
                      <strong style={{ fontSize: '1.1rem' }}>{report.medicationName}</strong>
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span>🐾 {getPetName(report.petId)}</span>
                      {report.dosage && <span>💊 {report.dosage}</span>}
                      {report.startDate && <span>📅 Start: {report.startDate}</span>}
                      {report.endDate && (
                        <span>
                          📅 End: {report.endDate}
                          {daysRemaining !== null && daysRemaining >= 0 && (
                            <span style={{ color: daysRemaining <= 7 ? '#dc3545' : '#28a745', marginLeft: '0.5rem' }}>
                              ({daysRemaining} days left)
                            </span>
                          )}
                          {daysRemaining !== null && daysRemaining < 0 && (
                            <span style={{ color: '#dc3545', marginLeft: '0.5rem' }}>
                              (Overdue by {Math.abs(daysRemaining)} days)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    {report.notes && (
                      <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                        📝 {report.notes}
                      </div>
                    )}
                  </div>
                  
                  {user?.role === 'DOCTOR' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={() => handleEdit(report)}
                        style={{ padding: '0.4rem 0.75rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDelete(report.reportId)}
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingReport ? '💊 Edit Medication' : '➕ Add Medication'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Medication Information */}
              <div className="form-section">
                <h3 className="form-section-title">💊 Medication Information</h3>
                
                <div className="form-group">
                  <label htmlFor="petId">Pet *</label>
                  <select
                    id="petId"
                    name="petId"
                    value={formData.petId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a pet</option>
                    {pets.map(p => (
                      <option key={p.petId} value={p.petId}>{p.petName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="medicationName">Medication Name *</label>
                    <input
                      type="text"
                      id="medicationName"
                      name="medicationName"
                      value={formData.medicationName}
                      onChange={handleInputChange}
                      placeholder="e.g., Amoxicillin"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dosage">Dosage</label>
                    <input
                      type="text"
                      id="dosage"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      placeholder="e.g., 50mg twice daily"
                    />
                  </div>
                </div>
              </div>

              {/* Treatment Period */}
              <div className="form-section">
                <h3 className="form-section-title">📅 Treatment Period</h3>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate}
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
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingReport ? 'Update Medication' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medications;

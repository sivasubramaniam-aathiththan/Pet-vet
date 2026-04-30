import { useEffect, useState } from 'react';
import { appointmentAPI, medicationAPI, vaccinationAPI, petAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Doctor Appointments Page
 * 
 * Allows doctors to:
 * - View all their appointments
 * - See upcoming appointments
 * - Update appointment status (PENDING → CONFIRMED → COMPLETED)
 * - View patient and pet details
 * - See medication and vaccination tasks (todo list)
 */
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [pets, setPets] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeTab, setActiveTab] = useState('appointments');
  const [showVacModal, setShowVacModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingVac, setEditingVac] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [vacForm, setVacForm] = useState({
    petId: '',
    vaccineName: '',
    vaccinationDate: '',
    nextVaccinationDate: '',
    notes: ''
  });
  const [reportForm, setReportForm] = useState({
    petId: '',
    medicationName: '',
    dosage: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const statusColors = {
    PENDING: { bg: '#FFF3CD', color: '#856404', border: '#FFEEBA' },
    CONFIRMED: { bg: '#D4EDDA', color: '#155724', border: '#C3E6CB' },
    COMPLETED: { bg: '#D1ECF1', color: '#0C5460', border: '#BEE5EB' },
    CANCELLED: { bg: '#F8D7DA', color: '#721C24', border: '#F5C6CB' }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allRes, upcomingRes, medsRes, vacsRes, petsRes] = await Promise.all([
        appointmentAPI.getDoctorAppointments(),
        appointmentAPI.getUpcomingDoctor(),
        medicationAPI.getAll(),
        vaccinationAPI.getAll(),
        petAPI.getAll()
      ]);

      setAppointments(allRes.data.data || []);
      setUpcomingAppointments(upcomingRes.data.data || []);
      setMedications(medsRes.data.data || []);
      setVaccinations(vacsRes.data.data || []);
      setPets(petsRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, newStatus);
      toast.success(`Appointment ${newStatus.toLowerCase()} successfully!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'PENDING': 'CONFIRMED',
      'CONFIRMED': 'COMPLETED',
      'COMPLETED': null,
      'CANCELLED': null
    };
    return statusFlow[currentStatus];
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.petId === petId);
    return pet ? pet.petName : 'Unknown';
  };

  // Vaccination form handlers
  const handleVacChange = (e) => {
    const { name, value } = e.target;
    setVacForm(prev => ({ ...prev, [name]: value }));
  };

  const handleVacSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        petId: parseInt(vacForm.petId),
        vaccineName: vacForm.vaccineName,
        vaccinationDate: vacForm.vaccinationDate,
        nextVaccinationDate: vacForm.nextVaccinationDate,
        notes: vacForm.notes
      };
      if (editingVac) {
        await vaccinationAPI.update(editingVac.vaccinationId, data);
        toast.success('Vaccination updated successfully!');
      } else {
        await vaccinationAPI.create(data);
        toast.success('Vaccination added successfully!');
      }
      setShowVacModal(false);
      setEditingVac(null);
      setVacForm({ petId: '', vaccineName: '', vaccinationDate: '', nextVaccinationDate: '', notes: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to save vaccination');
      console.error('Error:', error);
    }
  };

  // Report form handlers
  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportForm(prev => ({ ...prev, [name]: value }));
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        petId: parseInt(reportForm.petId),
        medicationName: reportForm.medicationName,
        dosage: reportForm.dosage,
        startDate: reportForm.startDate,
        endDate: reportForm.endDate,
        notes: reportForm.notes
      };
      if (editingReport) {
        await medicationAPI.update(editingReport.reportId, data);
        toast.success('Report updated successfully!');
      } else {
        await medicationAPI.create(data);
        toast.success('Report added successfully!');
      }
      setShowReportModal(false);
      setEditingReport(null);
      setReportForm({ petId: '', medicationName: '', dosage: '', startDate: '', endDate: '', notes: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to save report');
      console.error('Error:', error);
    }
  };

  const handleVacEdit = (v) => {
    setEditingVac(v);
    setVacForm({
      petId: v.petId,
      vaccineName: v.vaccineName,
      vaccinationDate: v.vaccinationDate,
      nextVaccinationDate: v.nextVaccinationDate,
      notes: v.notes
    });
    setShowVacModal(true);
  };

  const handleReportEdit = (m) => {
    setEditingReport(m);
    setReportForm({
      petId: m.petId,
      medicationName: m.medicationName,
      dosage: m.dosage,
      startDate: m.startDate,
      endDate: m.endDate,
      notes: m.notes
    });
    setShowReportModal(true);
  };

  // Medication status helper
  const getMedicationStatus = (report) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = report.startDate ? new Date(report.startDate) : null;
    const endDate = report.endDate ? new Date(report.endDate) : null;
    
    if (!startDate) return { text: 'Not Started', color: '#6c757d', bg: '#f8f9fa' };
    if (endDate && endDate < today) return { text: 'Completed', color: '#28a745', bg: '#d4edda' };
    if (startDate <= today && (!endDate || endDate >= today)) return { text: 'Active', color: '#007bff', bg: '#cce5ff' };
    if (startDate > today) return { text: 'Upcoming', color: '#ffc107', bg: '#fff3cd' };
    return { text: 'Active', color: '#007bff', bg: '#cce5ff' };
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Vaccination status helper
  const getVaccinationStatus = (nextDate) => {
    if (!nextDate) return { text: 'No next date', color: '#6c757d', bg: '#f8f9fa', icon: '❓' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(nextDate);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `Overdue by ${Math.abs(diffDays)} days`, color: '#dc3545', bg: '#f8d7da', icon: '⚠️' };
    if (diffDays <= 7) return { text: `Due in ${diffDays} days`, color: '#dc3545', bg: '#f8d7da', icon: '🚨' };
    if (diffDays <= 30) return { text: `Due in ${diffDays} days`, color: '#ffc107', bg: '#fff3cd', icon: '⏰' };
    return { text: `Due in ${diffDays} days`, color: '#28a745', bg: '#d4edda', icon: '✅' };
  };

  const filteredAppointments = filterStatus === 'ALL'
    ? appointments
    : appointments.filter(apt => apt.status === filterStatus);

  // Filter active medications (not completed)
  const activeMedications = medications.filter(m => {
    const status = getMedicationStatus(m);
    return status.text === 'Active' || status.text === 'Upcoming';
  });

  // Filter urgent vaccinations (due soon or overdue)
  const urgentVaccinations = vaccinations.filter(v => {
    const days = getDaysRemaining(v.nextVaccinationDate);
    return days !== null && days <= 30;
  }).sort((a, b) => {
    const daysA = getDaysRemaining(a.nextVaccinationDate) ?? 999;
    const daysB = getDaysRemaining(b.nextVaccinationDate) ?? 999;
    return daysA - daysB;
  });

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Doctor Dashboard</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Manage appointments, medications, and vaccinations
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 Appointments ({appointments.length})
        </button>
        <button
          className={`btn ${activeTab === 'medications' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('medications')}
        >
          💊 Medications ({activeMedications.length})
        </button>
        <button
          className={`btn ${activeTab === 'vaccinations' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('vaccinations')}
        >
          💉 Vaccinations ({urgentVaccinations.length})
        </button>
        <button
          className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('reports')}
        >
          📋 Reports ({medications.length})
        </button>
      </div>

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">📅</div>
              <div className="stat-value">{appointments.length}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
            <div className="stat-card stat-card-warning">
              <div className="stat-icon">⏰</div>
              <div className="stat-value">{upcomingAppointments.length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-card stat-card-success">
              <div className="stat-icon">✅</div>
              <div className="stat-value">
                {appointments.filter(a => a.status === 'CONFIRMED').length}
              </div>
              <div className="stat-label">Confirmed</div>
            </div>
            <div className="stat-card stat-card-info">
              <div className="stat-icon">🏁</div>
              <div className="stat-value">
                {appointments.filter(a => a.status === 'COMPLETED').length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          {/* Upcoming Appointments Alert */}
          {upcomingAppointments.length > 0 && (
            <div className="alert alert-info">
              <strong>⏰ Upcoming Appointments</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                You have {upcomingAppointments.length} appointment(s) scheduled for the coming days.
              </p>
            </div>
          )}

          {/* Status Filter */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ fontWeight: '500' }}>Filter by Status:</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
                  <button
                    key={status}
                    className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="card">
            <h3 className="card-header">📋 Appointment List</h3>
            
            {filteredAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>
                  {filterStatus === 'ALL' 
                    ? 'No appointments yet.' 
                    : `No ${filterStatus.toLowerCase()} appointments.`}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Pet Owner</th>
                      <th>Pet</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => {
                      const statusStyle = statusColors[appointment.status] || statusColors.PENDING;
                      const nextStatus = getNextStatus(appointment.status);
                      
                      return (
                        <tr key={appointment.appointmentId}>
                          <td>
                            <div>
                              <strong>{formatDate(appointment.appointmentDate)}</strong>
                              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                {formatTime(appointment.appointmentTime)}
                              </div>
                            </div>
                          </td>
                          <td>{appointment.userName}</td>
                          <td><strong>{appointment.petName}</strong></td>
                          <td>{appointment.reason || '-'}</td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color,
                                border: `1px solid ${statusStyle.border}`,
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '500'
                              }}
                            >
                              {appointment.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-info btn-sm"
                              onClick={() => window.location.href = `/doctor/records/${appointment.petId}`}
                            >
                              View
                            </button>
                            {nextStatus && (
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => handleStatusUpdate(appointment.appointmentId, nextStatus)}
                                style={{ marginLeft: '0.25rem' }}
                              >
                                Mark as {nextStatus}
                              </button>
                            )}
                            {appointment.status === 'PENDING' && (
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleStatusUpdate(appointment.appointmentId, 'CANCELLED')}
                                style={{ marginLeft: '0.5rem' }}
                              >
                                Cancel
                              </button>
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
        </>
      )}

      {/* Medications Tab - Todo List */}
      {activeTab === 'medications' && (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">💊</div>
              <div className="stat-value">{medications.length}</div>
              <div className="stat-label">Total Medications</div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#cce5ff', border: '2px solid #007bff' }}>
              <div className="stat-icon">▶️</div>
              <div className="stat-value">{medications.filter(m => getMedicationStatus(m).text === 'Active').length}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#fff3cd', border: '2px solid #ffc107' }}>
              <div className="stat-icon">⏰</div>
              <div className="stat-value">{medications.filter(m => getMedicationStatus(m).text === 'Upcoming').length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#d4edda', border: '2px solid #28a745' }}>
              <div className="stat-icon">✅</div>
              <div className="stat-value">{medications.filter(m => getMedicationStatus(m).text === 'Completed').length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/medications'}
            >
              + Add Medication
            </button>
          </div>

          {/* Medication Todo List */}
          <div className="card">
            <h3 className="card-header">💊 Medication Tasks</h3>
            
            {activeMedications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No active or upcoming medications.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => window.location.href = '/medications'}
                >
                  Go to Medications Page
                </button>
              </div>
            ) : (
              <div className="todo-list">
                {activeMedications.map((med) => {
                  const status = getMedicationStatus(med);
                  const daysRemaining = getDaysRemaining(med.endDate);
                  
                  return (
                    <div 
                      key={med.reportId}
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
                          <strong style={{ fontSize: '1.1rem' }}>{med.medicationName}</strong>
                        </div>
                        <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span>🐾 {getPetName(med.petId)}</span>
                          {med.dosage && <span>💊 {med.dosage}</span>}
                          {med.startDate && <span>📅 Start: {med.startDate}</span>}
                          {med.endDate && (
                            <span>
                              📅 End: {med.endDate}
                              {daysRemaining !== null && daysRemaining >= 0 && (
                                <span style={{ color: daysRemaining <= 7 ? '#dc3545' : '#28a745', marginLeft: '0.5rem', fontWeight: 'bold' }}>
                                  ({daysRemaining} days left)
                                </span>
                              )}
                              {daysRemaining !== null && daysRemaining < 0 && (
                                <span style={{ color: '#dc3545', marginLeft: '0.5rem', fontWeight: 'bold' }}>
                                  (Overdue by {Math.abs(daysRemaining)} days)
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                        {med.notes && (
                          <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                            📝 {med.notes}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => window.location.href = `/medications?petId=${med.petId}`}
                        style={{ padding: '0.4rem 0.75rem' }}
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Vaccinations Tab - Todo List */}
      {activeTab === 'vaccinations' && (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">💉</div>
              <div className="stat-value">{vaccinations.length}</div>
              <div className="stat-label">Total Vaccinations</div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#f8d7da', border: '2px solid #dc3545' }}>
              <div className="stat-icon">⚠️</div>
              <div className="stat-value">{vaccinations.filter(v => getDaysRemaining(v.nextVaccinationDate) < 0).length}</div>
              <div className="stat-label">Overdue</div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#fff3cd', border: '2px solid #ffc107' }}>
              <div className="stat-icon">⏰</div>
              <div className="stat-value">{vaccinations.filter(v => { const d = getDaysRemaining(v.nextVaccinationDate); return d !== null && d >= 0 && d <= 30; }).length}</div>
              <div className="stat-label">Due Soon</div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#d4edda', border: '2px solid #28a745' }}>
              <div className="stat-icon">✅</div>
              <div className="stat-value">{vaccinations.filter(v => { const d = getDaysRemaining(v.nextVaccinationDate); return d !== null && d > 30; }).length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => { setShowVacModal(true); setEditingVac(null); }}
            >
              + Add Vaccination
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.href = '/vaccinations'}
            >
              View All Vaccinations
            </button>
          </div>

          {/* Vaccination Todo List */}
          <div className="card">
            <h3 className="card-header">💉 Vaccination Tasks</h3>
            
            {urgentVaccinations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No urgent vaccinations. All vaccinations are up to date!</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => window.location.href = '/vaccinations'}
                >
                  Go to Vaccinations Page
                </button>
              </div>
            ) : (
              <div className="todo-list">
                {urgentVaccinations.map((vac) => {
                  const status = getVaccinationStatus(vac.nextVaccinationDate);
                  const daysUntil = getDaysRemaining(vac.nextVaccinationDate);
                  
                  return (
                    <div 
                      key={vac.vaccinationId}
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
                          <strong style={{ fontSize: '1.1rem' }}>{vac.vaccineName}</strong>
                        </div>
                        <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <span>🐾 {getPetName(vac.petId)}</span>
                          {vac.vaccinationDate && (
                            <span>📅 Last: {new Date(vac.vaccinationDate).toLocaleDateString()}</span>
                          )}
                          {vac.nextVaccinationDate && (
                            <span>
                              📅 Next: {new Date(vac.nextVaccinationDate).toLocaleDateString()}
                              {daysUntil !== null && daysUntil < 0 && (
                                <span style={{ color: '#dc3545', fontWeight: 'bold', marginLeft: '0.5rem' }}>
                                  (OVERDUE!)
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                        {vac.notes && (
                          <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                            📝 {vac.notes}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => window.location.href = `/vaccinations?petId=${vac.petId}`}
                        style={{ padding: '0.4rem 0.75rem' }}
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">📋</div>
              <div className="stat-value">{medications.length}</div>
              <div className="stat-label">Total Reports</div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#cce5ff', border: '2px solid #007bff' }}>
              <div className="stat-icon">▶️</div>
              <div className="stat-value">{medications.filter(m => getMedicationStatus(m).text === 'Active').length}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#fff3cd', border: '2px solid #ffc107' }}>
              <div className="stat-icon">⏰</div>
              <div className="stat-value">{medications.filter(m => getMedicationStatus(m).text === 'Upcoming').length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-card" style={{ backgroundColor: '#d4edda', border: '2px solid #28a745' }}>
              <div className="stat-icon">✅</div>
              <div className="stat-value">{medications.filter(m => getMedicationStatus(m).text === 'Completed').length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => { setShowReportModal(true); setEditingReport(null); }}
            >
              + Add Report
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.href = '/medications'}
            >
              View All Reports
            </button>
          </div>

          {/* Reports List */}
          <div className="card">
            <h3 className="card-header">📋 Medication Reports</h3>
            
            {medications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No medication reports yet.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => { setShowReportModal(true); setEditingReport(null); }}
                >
                  Create First Report
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Pet</th>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Period</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map((report) => {
                      const status = getMedicationStatus(report);
                      const daysRemaining = getDaysRemaining(report.endDate);
                      
                      return (
                        <tr key={report.reportId}>
                          <td><strong>{getPetName(report.petId)}</strong></td>
                          <td>{report.medicationName}</td>
                          <td>{report.dosage || '-'}</td>
                          <td>
                            {report.startDate && report.endDate ? (
                              <div>
                                <div>{report.startDate} → {report.endDate}</div>
                                {daysRemaining !== null && daysRemaining >= 0 && (
                                  <small style={{ color: daysRemaining <= 7 ? '#dc3545' : '#28a745' }}>
                                    {daysRemaining} days left
                                  </small>
                                )}
                                {daysRemaining !== null && daysRemaining < 0 && (
                                  <small style={{ color: '#dc3545' }}>
                                    Overdue by {Math.abs(daysRemaining)} days
                                  </small>
                                )}
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{
                                backgroundColor: status.bg,
                                color: status.color,
                                border: `1px solid ${status.color}`,
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '500'
                              }}
                            >
                              {status.text}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleReportEdit(report)}
                              style={{ marginRight: '0.25rem' }}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-info btn-sm"
                              onClick={() => window.location.href = `/doctor/records/${report.petId}`}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Vaccination Modal */}
      {showVacModal && (
        <div className="modal-overlay" onClick={() => setShowVacModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingVac ? '✏️ Edit Vaccination' : '💉 Add New Vaccination'}
              </h3>
              <button 
                className="modal-close" 
                onClick={() => setShowVacModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleVacSubmit}>
              {/* Vaccination Information */}
              <div className="form-section">
                <h3 className="form-section-title">💉 Vaccination Information</h3>

                <div className="form-group">
                  <label htmlFor="vacPetId">Select Pet *</label>
                  <select
                    id="vacPetId"
                    name="petId"
                    value={vacForm.petId}
                    onChange={handleVacChange}
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
                  <label htmlFor="vacVaccineName">Vaccine Name *</label>
                  <input
                    type="text"
                    id="vacVaccineName"
                    name="vaccineName"
                    value={vacForm.vaccineName}
                    onChange={handleVacChange}
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
                    <label htmlFor="vacVaccinationDate">Vaccination Date *</label>
                    <input
                      type="date"
                      id="vacVaccinationDate"
                      name="vaccinationDate"
                      value={vacForm.vaccinationDate}
                      onChange={handleVacChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="vacNextVaccinationDate">Next Due Date *</label>
                    <input
                      type="date"
                      id="vacNextVaccinationDate"
                      name="nextVaccinationDate"
                      value={vacForm.nextVaccinationDate}
                      onChange={handleVacChange}
                      required
                      min={vacForm.vaccinationDate}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="form-section">
                <h3 className="form-section-title">📝 Additional Information</h3>
                <div className="form-group">
                  <label htmlFor="vacNotes">Notes</label>
                  <textarea
                    id="vacNotes"
                    name="notes"
                    value={vacForm.notes}
                    onChange={handleVacChange}
                    rows="3"
                    placeholder="Any additional information about this vaccination..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowVacModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVac ? 'Update Vaccination' : 'Add Vaccination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingReport ? '✏️ Edit Report' : '📋 Add New Report'}
              </h3>
              <button 
                className="modal-close" 
                onClick={() => setShowReportModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleReportSubmit}>
              {/* Report Information */}
              <div className="form-section">
                <h3 className="form-section-title">📋 Report Information</h3>

                <div className="form-group">
                  <label htmlFor="reportPetId">Select Pet *</label>
                  <select
                    id="reportPetId"
                    name="petId"
                    value={reportForm.petId}
                    onChange={handleReportChange}
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
                  <label htmlFor="reportMedicationName">Medication Name *</label>
                  <input
                    type="text"
                    id="reportMedicationName"
                    name="medicationName"
                    value={reportForm.medicationName}
                    onChange={handleReportChange}
                    required
                    placeholder="e.g., Amoxicillin, Metronidazole, Prednisone"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reportDosage">Dosage</label>
                  <input
                    type="text"
                    id="reportDosage"
                    name="dosage"
                    value={reportForm.dosage}
                    onChange={handleReportChange}
                    placeholder="e.g., 500mg twice daily, 10mg/kg every 8 hours"
                  />
                </div>
              </div>

              {/* Treatment Period */}
              <div className="form-section">
                <h3 className="form-section-title">📅 Treatment Period</h3>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="reportStartDate">Start Date</label>
                    <input
                      type="date"
                      id="reportStartDate"
                      name="startDate"
                      value={reportForm.startDate}
                      onChange={handleReportChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reportEndDate">End Date</label>
                    <input
                      type="date"
                      id="reportEndDate"
                      name="endDate"
                      value={reportForm.endDate}
                      onChange={handleReportChange}
                      min={reportForm.startDate}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="form-section">
                <h3 className="form-section-title">📝 Additional Information</h3>
                <div className="form-group">
                  <label htmlFor="reportNotes">Notes</label>
                  <textarea
                    id="reportNotes"
                    name="notes"
                    value={reportForm.notes}
                    onChange={handleReportChange}
                    rows="3"
                    placeholder="Any additional information about this medication report..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingReport ? 'Update Report' : 'Add Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;

import { useEffect, useState } from 'react';
import { appointmentAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Doctor Appointments Page
 * 
 * Allows doctors to:
 * - View all their appointments
 * - See upcoming appointments
 * - Update appointment status (PENDING → CONFIRMED → COMPLETED)
 * - View patient and pet details
 */
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const statusColors = {
    PENDING: { bg: '#FFF3CD', color: '#856404', border: '#FFEEBA' },
    CONFIRMED: { bg: '#D4EDDA', color: '#155724', border: '#C3E6CB' },
    COMPLETED: { bg: '#D1ECF1', color: '#0C5460', border: '#BEE5EB' },
    CANCELLED: { bg: '#F8D7DA', color: '#721C24', border: '#F5C6CB' }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const [allRes, upcomingRes] = await Promise.all([
        appointmentAPI.getDoctorAppointments(),
        appointmentAPI.getUpcomingDoctor()
      ]);

      setAppointments(allRes.data.data || []);
      setUpcomingAppointments(upcomingRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load appointments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, newStatus);
      toast.success(`Appointment ${newStatus.toLowerCase()} successfully!`);
      fetchAppointments();
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

  const filteredAppointments = filterStatus === 'ALL'
    ? appointments
    : appointments.filter(apt => apt.status === filterStatus);

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>My Appointments</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Manage your patient appointments
          </p>
        </div>
      </div>

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
    </div>
  );
};

export default DoctorAppointments;

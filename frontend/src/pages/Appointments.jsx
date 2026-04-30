import { useEffect, useState } from 'react';
import { appointmentAPI, petAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Appointments Page
 * 
 * Allows users to:
 * - View available doctors
 * - Book appointments with doctors
 * - View their appointments
 * - Cancel appointments
 */
const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
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
      
      // Fetch doctors, pets, and appointments
      const [doctorsRes, petsRes, appointmentsRes] = await Promise.all([
        appointmentAPI.getDoctors().catch(err => {
          console.error('Doctors API error:', err);
          return { data: { data: [] } };
        }),
        petAPI.getAll().catch(err => {
          console.error('Pets API error:', err);
          return { data: { data: [] } };
        }),
        appointmentAPI.getUserAppointments().catch(err => {
          console.error('Appointments API error:', err);
          return { data: { data: [] } };
        })
      ]);

      console.log('Doctors response:', doctorsRes.data);
      console.log('Pets response:', petsRes.data);
      console.log('Appointments response:', appointmentsRes.data);

      setDoctors(doctorsRes.data.data || []);
      setPets(petsRes.data.data || []);
      setAppointments(appointmentsRes.data.data || []);
      
      // Show info if no doctors
      if (!doctorsRes.data.data || doctorsRes.data.data.length === 0) {
        toast.info('No doctors available. Please contact admin to add doctors.');
      }
    } catch (error) {
      toast.error('Failed to load data: ' + (error.response?.data?.message || error.message));
      console.error('Error fetching data:', error);
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

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData(prev => ({
      ...prev,
      doctorId: doctor.doctorId
    }));
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.petId) {
      toast.error('Please select a pet');
      return;
    }
    if (!formData.appointmentDate) {
      toast.error('Please select an appointment date');
      return;
    }
    if (!formData.appointmentTime) {
      toast.error('Please select an appointment time');
      return;
    }

    try {
      const appointmentData = {
        petId: parseInt(formData.petId),
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
        notes: ''
      };

      console.log('Sending appointment data:', appointmentData);
      
      await appointmentAPI.book(appointmentData);
      toast.success('Appointment booked successfully!');
      
      resetForm();
      setShowModal(false);
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to book appointment';
      toast.error(errorMessage);
      console.error('Error booking appointment:', error);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await appointmentAPI.cancel(appointmentId);
      toast.success('Appointment cancelled successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      petId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      reason: ''
    });
    setSelectedDoctor(null);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
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

  if (loading) {
    return (
      <div className="container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Doctor Appointments</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Book appointments with our veterinary doctors
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">👨‍⚕️</div>
          <div className="stat-value">{doctors.length}</div>
          <div className="stat-label">Available Doctors</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{appointments.length}</div>
          <div className="stat-label">My Appointments</div>
        </div>
        <div className="stat-card stat-card-info">
          <div className="stat-icon">⏰</div>
          <div className="stat-value">
            {appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length}
          </div>
          <div className="stat-label">Upcoming</div>
        </div>
      </div>

      {/* Available Doctors */}
      <div className="card">
        <h3 className="card-header">👨‍⚕️ Available Doctors</h3>
        
        {doctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            <p>No doctors available at the moment.</p>
          </div>
        ) : (
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor.doctorId} className="doctor-card">
                <div className="doctor-info">
                  <div className="doctor-avatar">
                    {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                  </div>
                  <div>
                    <h4>Dr. {doctor.firstName} {doctor.lastName}</h4>
                    <p className="doctor-specialization">
                      {doctor.specialization || 'General Veterinarian'}
                    </p>
                    {doctor.availability && (
                      <p className="doctor-availability">
                        📅 {doctor.availability}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleBookAppointment(doctor)}
                  disabled={pets.length === 0}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
        
        {pets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1rem', background: '#FFF3CD', borderRadius: '8px', marginTop: '1rem' }}>
            <p style={{ color: '#856404', margin: 0 }}>
              ⚠️ You need to add a pet before booking an appointment.
            </p>
          </div>
        )}
      </div>

      {/* My Appointments */}
      <div className="card">
        <h3 className="card-header">📋 My Appointments</h3>
        
        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No appointments yet.</p>
            <p style={{ color: '#999', marginTop: '0.5rem' }}>
              Book your first appointment with a doctor above.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => {
                  const statusStyle = statusColors[appointment.status] || statusColors.PENDING;
                  return (
                    <tr key={appointment.appointmentId}>
                      <td><strong>{appointment.petName}</strong></td>
                      <td>Dr. {appointment.doctorName}</td>
                      <td>{formatDate(appointment.appointmentDate)}</td>
                      <td>{formatTime(appointment.appointmentTime)}</td>
                      <td>{appointment.reason || '-'}</td>
                      <td>
                        <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancelAppointment(appointment.appointmentId)}
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

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Doctor Info Display */}
              {selectedDoctor && (
                <div className="doctor-info-card">
                  <div className="doctor-info-header">
                    <div className="doctor-avatar">
                      {selectedDoctor.firstName.charAt(0)}{selectedDoctor.lastName.charAt(0)}
                    </div>
                    <div>
                      <h4>Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</h4>
                      <p>{selectedDoctor.specialization || 'General Veterinarian'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Appointment Details */}
              <div className="form-section">
                <h3 className="form-section-title">📅 Appointment Details</h3>
                
                <div className="form-group">
                  <label htmlFor="petId">Select Pet *</label>
                  <select
                    id="petId"
                    name="petId"
                    value={formData.petId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose your pet</option>
                    {pets.map(pet => (
                      <option key={pet.petId} value={pet.petId}>
                        {pet.petName} ({pet.breed})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="appointmentDate">Appointment Date *</label>
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="appointmentTime">Appointment Time *</label>
                    <input
                      type="time"
                      id="appointmentTime"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reason">Reason for Visit</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe the reason for this appointment..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!formData.petId || !formData.appointmentDate || !formData.appointmentTime}
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;

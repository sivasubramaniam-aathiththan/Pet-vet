import { useEffect, useState } from 'react';
import { vaccinationAPI, medicationAPI, petAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

// reuse some helpers from Vaccinations page
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

const DoctorRecords = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVacModal, setShowVacModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [editingVac, setEditingVac] = useState(null);
  const [editingMed, setEditingMed] = useState(null);
  const [vacForm, setVacForm] = useState({
    petId: String(petId || ''),
    vaccineName: '',
    vaccinationDate: '',
    nextVaccinationDate: '',
    notes: ''
  });
  const [medForm, setMedForm] = useState({
    petId: String(petId || ''),
    medicationName: '',
    dosage: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [petId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petRes, vacRes, medRes] = await Promise.all([
        petAPI.getById(petId),
        vaccinationAPI.getByPet(petId),
        medicationAPI.getByPet(petId)
      ]);
      setPet(petRes.data.data);
      setVaccinations(vacRes.data.data || []);
      setMedications(medRes.data.data || []);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to load records';
      toast.error(msg);
      console.error('fetchData error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVacChange = (e) => {
    const { name, value } = e.target;
    setVacForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMedChange = (e) => {
    const { name, value } = e.target;
    setMedForm(prev => ({ ...prev, [name]: value }));
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
        toast.success('Vaccination updated');
      } else {
        await vaccinationAPI.create(data);
        toast.success('Vaccination added');
      }
      setShowVacModal(false);
      setEditingVac(null);
      setVacForm({ petId: String(petId || ''), vaccineName:'', vaccinationDate:'', nextVaccinationDate:'', notes:'' });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save vaccination';
      toast.error(msg);
      console.error('vac save error', err);
    }
  };

  const handleMedSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        petId: parseInt(medForm.petId),
        medicationName: medForm.medicationName,
        dosage: medForm.dosage,
        startDate: medForm.startDate,
        endDate: medForm.endDate,
        notes: medForm.notes
      };
      if (editingMed) {
        await medicationAPI.update(editingMed.reportId, data);
        toast.success('Report updated');
      } else {
        await medicationAPI.create(data);
        toast.success('Report added');
      }
      setShowMedModal(false);
      setEditingMed(null);
      setMedForm({ petId: String(petId || ''), medicationName:'', dosage:'', startDate:'', endDate:'', notes:'' });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save report';
      toast.error(msg);
      console.error('med save error', err);
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

  const handleMedEdit = (m) => {
    setEditingMed(m);
    setMedForm({
      petId: m.petId,
      medicationName: m.medicationName,
      dosage: m.dosage,
      startDate: m.startDate,
      endDate: m.endDate,
      notes: m.notes
    });
    setShowMedModal(true);
  };

  const handleVacDelete = async (id) => {
    if (!window.confirm('Delete this vaccination?')) return;
    try { await vaccinationAPI.delete(id); toast.success('Deleted'); fetchData(); }
    catch (e){ toast.error('Failed to delete'); }
  };

  const handleMedDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try { await medicationAPI.delete(id); toast.success('Deleted'); fetchData(); }
    catch (e){ toast.error('Failed to delete'); }
  };

  const navigateToVaccinations = () => {
    navigate(`/vaccinations?petId=${petId}`);
  };

  const navigateToMedications = () => {
    navigate(`/medications?petId=${petId}`);
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <h1>Patient Records for {pet?.petName}</h1>

      {/* Vaccinations section */}
      <div className="page-header" style={{ marginTop: '2rem' }}>
        <h2>Vaccinations</h2>
        <button className="btn btn-primary" onClick={() => { setShowVacModal(true); setEditingVac(null); }}>
          + Add Vaccination
        </button>
      </div>
      {vaccinations.length === 0 ? (
        <p>No vaccinations recorded.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Vaccine</th>
              <th>Date</th>
              <th>Next Due</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccinations.map(v => {
              const status = getVaccinationStatus(v.nextVaccinationDate);
              return (
                <tr key={v.vaccinationId}>
                  <td>{v.vaccineName}</td>
                  <td>{formatDate(v.vaccinationDate)}</td>
                  <td>{formatDate(v.nextVaccinationDate)}</td>
                  <td style={{ color: status.color }}>{status.text}</td>
                  <td>{v.notes || '-'}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleVacEdit(v)}>Edit</button>
                    &nbsp;
                    <button className="btn btn-danger btn-sm" onClick={() => handleVacDelete(v.vaccinationId)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Medications section */}
      <div className="page-header" style={{ marginTop: '2rem' }}>
        <h2>Medication Reports</h2>
        <button className="btn btn-primary" onClick={() => { setShowMedModal(true); setEditingMed(null); }}>
          + Add Report
        </button>
      </div>
      {medications.length === 0 ? (
        <p>No medication reports.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Start</th>
              <th>End</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.map(m => (
              <tr key={m.reportId}>
                <td>{m.medicationName}</td>
                <td>{m.dosage || '-'}</td>
                <td>{m.startDate || '-'}</td>
                <td>{m.endDate || '-'}</td>
                <td>{m.notes || '-'}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleMedEdit(m)}>Edit</button>
                  &nbsp;
                  <button className="btn btn-danger btn-sm" onClick={() => handleMedDelete(m.reportId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Vaccination modal */}
      {showVacModal && (
        <div className="modal-overlay" onClick={() => setShowVacModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingVac ? 'Edit Vaccination' : 'Add Vaccination'}</h3>
            <form onSubmit={handleVacSubmit}>
              <div className="form-group">
                <label>Vaccine Name</label>
                <input name="vaccineName" value={vacForm.vaccineName} onChange={handleVacChange} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="vaccinationDate" value={vacForm.vaccinationDate} onChange={handleVacChange} required />
              </div>
              <div className="form-group">
                <label>Next Due Date</label>
                <input type="date" name="nextVaccinationDate" value={vacForm.nextVaccinationDate} onChange={handleVacChange} required />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" value={vacForm.notes} onChange={handleVacChange} />
              </div>
              <button type="submit" className="btn btn-primary">{editingVac ? 'Save' : 'Add'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Medication modal */}
      {showMedModal && (
        <div className="modal-overlay" onClick={() => setShowMedModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{editingMed ? 'Edit Report' : 'Add Report'}</h3>
            <form onSubmit={handleMedSubmit}>
              <div className="form-group">
                <label>Medication Name</label>
                <input name="medicationName" value={medForm.medicationName} onChange={handleMedChange} required />
              </div>
              <div className="form-group">
                <label>Dosage</label>
                <input name="dosage" value={medForm.dosage} onChange={handleMedChange} />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={medForm.startDate} onChange={handleMedChange} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={medForm.endDate} onChange={handleMedChange} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" value={medForm.notes} onChange={handleMedChange} />
              </div>
              <button type="submit" className="btn btn-primary">{editingMed ? 'Save' : 'Add'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRecords;
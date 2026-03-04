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

  const filtered = selectedPet === 'ALL'
    ? reports
    : reports.filter(r => r.petId === parseInt(selectedPet));

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Medication Reports</h1>
        {user?.role === 'DOCTOR' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Report
          </button>
        )}
      </div>

      <div className="filters">
        <select value={selectedPet} onChange={e => setSelectedPet(e.target.value)}>
          <option value="ALL">All pets</option>
          {pets.map(p => (
            <option key={p.petId} value={p.petId}>{p.petName}</option>
          ))}
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Pet</th>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Start</th>
            <th>End</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.reportId}>
              <td>{getPetName(r.petId)}</td>
              <td>{r.medicationName}</td>
              <td>{r.dosage || '-'}</td>
              <td>{r.startDate || '-'}</td>
              <td>{r.endDate || '-'}</td>
              <td>{r.notes || '-'}</td>
              <td>
                {user?.role === 'DOCTOR' ? (
                  <>
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(r)}>Edit</button>
                    &nbsp;
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.reportId)}>Delete</button>
                  </>
                ) : (
                  <span style={{color:'#666'}}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingReport ? 'Edit Report' : 'Add Report'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Pet</label>
                <select name="petId" value={formData.petId} onChange={handleInputChange} required>
                  <option value="">Select a pet</option>
                  {pets.map(p => (
                    <option key={p.petId} value={p.petId}>{p.petName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Medication Name</label>
                <input name="medicationName" value={formData.medicationName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Dosage</label>
                <input name="dosage" value={formData.dosage} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} />
              </div>
              <button type="submit" className="btn btn-primary">
                {editingReport ? 'Save' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medications;

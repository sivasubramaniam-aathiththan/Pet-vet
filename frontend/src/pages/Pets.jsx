import { useEffect, useState } from 'react';
import { petAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * Pet Management Page
 * 
 * Allows users to:
 * - View all their pets
 * - Add new pets
 * - Edit existing pets
 * - Delete pets
 * - View pet details
 */
const Pets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    petName: '',
    dateOfBirth: '',
    breed: '',
    species: '',
    gender: '',
    color: '',
    weight: '',
    petImage: '',
    notes: ''
  });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await petAPI.getAll();
      setPets(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load pets');
      console.error('Error fetching pets:', error);
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
      // Prepare data
      const petData = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null
      };

      if (editingPet) {
        // Update existing pet
        await petAPI.update(editingPet.petId, petData);
        toast.success('Pet updated successfully!');
      } else {
        // Create new pet
        await petAPI.create(petData);
        toast.success('Pet added successfully!');
      }

      // Reset form and close modal
      resetForm();
      setShowModal(false);
      fetchPets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save pet');
      console.error('Error saving pet:', error);
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      petName: pet.petName || '',
      dateOfBirth: pet.dateOfBirth || '',
      breed: pet.breed || '',
      species: pet.species || '',
      gender: pet.gender || '',
      color: pet.color || '',
      weight: pet.weight || '',
      petImage: pet.petImage || '',
      notes: pet.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet? This will also delete all associated records.')) {
      return;
    }

    try {
      await petAPI.delete(petId);
      toast.success('Pet deleted successfully!');
      fetchPets();
    } catch (error) {
      toast.error('Failed to delete pet');
      console.error('Error deleting pet:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      petName: '',
      dateOfBirth: '',
      breed: '',
      species: '',
      gender: '',
      color: '',
      weight: '',
      petImage: '',
      notes: ''
    });
    setEditingPet(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Pets</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add New Pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🐾</div>
          <h3>No Pets Yet</h3>
          <p>Start by adding your first pet!</p>
          <button className="btn btn-primary" onClick={openAddModal}>
            Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {pets.map((pet) => (
            <div key={pet.petId} className="pet-card">
              <div className="pet-image">
                {pet.petImage ? (
                  <img src={pet.petImage} alt={pet.petName} />
                ) : (
                  <div className="pet-image-placeholder">
                    <span>🐾</span>
                  </div>
                )}
              </div>
              
              <div className="pet-info">
                <h3>{pet.petName}</h3>
                <div className="pet-details">
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  {pet.species && <p><strong>Species:</strong> {pet.species}</p>}
                  {pet.gender && <p><strong>Gender:</strong> {pet.gender}</p>}
                  {pet.dateOfBirth && (
                    <p><strong>Age:</strong> {calculateAge(pet.dateOfBirth)} years</p>
                  )}
                  {pet.weight && <p><strong>Weight:</strong> {pet.weight} kg</p>}
                  {pet.color && <p><strong>Color:</strong> {pet.color}</p>}
                </div>
                
                {pet.notes && (
                  <div className="pet-notes">
                    <p><strong>Notes:</strong> {pet.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="pet-actions">
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => handleEdit(pet)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => handleDelete(pet.petId)}
                >
                  Delete
                </button>
                <a 
                  href={`/pets/${pet.petId}/expenses`} 
                  className="btn btn-primary btn-sm"
                >
                  Expenses
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Pet Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPet ? '✏️ Edit Pet' : '➕ Add New Pet'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="form-section">
                <h3 className="form-section-title">🐾 Basic Information</h3>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="petName">Pet Name *</label>
                    <input
                      type="text"
                      id="petName"
                      name="petName"
                      value={formData.petName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter pet name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth *</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="breed">Breed *</label>
                    <input
                      type="text"
                      id="breed"
                      name="breed"
                      value={formData.breed}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Golden Retriever"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="species">Species</label>
                    <select
                      id="species"
                      name="species"
                      value={formData.species}
                      onChange={handleInputChange}
                    >
                      <option value="">Select species</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Hamster">Hamster</option>
                      <option value="Fish">Fish</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Physical Characteristics */}
              <div className="form-section">
                <h3 className="form-section-title">📏 Physical Characteristics</h3>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="color">Color</label>
                    <input
                      type="text"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="e.g., Brown, White"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      placeholder="e.g., 25.5"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="petImage">Pet Image URL</label>
                    <input
                      type="url"
                      id="petImage"
                      name="petImage"
                      value={formData.petImage}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
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
                    placeholder="Any additional information about your pet..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPet ? 'Update Pet' : 'Add Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pets;

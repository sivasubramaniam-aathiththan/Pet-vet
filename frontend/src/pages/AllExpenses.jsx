import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseAPI, petAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * All Expenses Page
 * 
 * Shows all expenses across all pets with ability to add new expenses
 */
const AllExpenses = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    category: '',
    amount: '',
    month: '',
    description: ''
  });

  const categories = {
    FOOD: { icon: '🍖', label: 'Food', color: '#FF6B6B' },
    MEDICAL: { icon: '💊', label: 'Medical', color: '#4ECDC4' },
    GROOMING: { icon: '✂️', label: 'Grooming', color: '#95E1D3' },
    TOYS: { icon: '🎾', label: 'Toys', color: '#FFE66D' },
    TRAINING: { icon: '🎓', label: 'Training', color: '#A8E6CF' },
    OTHER: { icon: '📦', label: 'Other', color: '#C7CEEA' }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsRes, expensesRes] = await Promise.all([
        petAPI.getAll(),
        expenseAPI.getAll()
      ]);
      
      setPets(petsRes.data.data || []);
      setExpenses(expensesRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load data');
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
      // Convert month (YYYY-MM) to expenseDate (YYYY-MM-01)
      const expenseDate = formData.month ? `${formData.month}-01` : null;
      
      const expenseData = {
        petId: parseInt(formData.petId),
        category: formData.category,
        amount: parseFloat(formData.amount),
        expenseDate: expenseDate,
        description: formData.description
      };

      if (editingExpense) {
        await expenseAPI.update(editingExpense.expenseId, expenseData);
        toast.success('Expense updated successfully!');
      } else {
        await expenseAPI.create(expenseData);
        toast.success('Expense added successfully!');
      }

      resetForm();
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save expense');
      console.error('Error saving expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      petId: expense.petId || '',
      category: expense.category || '',
      amount: expense.amount || '',
      month: expense.month || '',
      description: expense.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await expenseAPI.delete(expenseId);
      toast.success('Expense deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete expense');
      console.error('Error deleting expense:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      petId: '',
      category: '',
      amount: '',
      month: '',
      description: ''
    });
    setEditingExpense(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.petId === petId);
    return pet ? pet.petName : 'Unknown Pet';
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>All Expenses</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Track expenses across all your pets
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{formatCurrency(getTotalExpenses())}</div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-label">Total Records</div>
        </div>
        <div className="stat-card stat-card-info">
          <div className="stat-icon">🐾</div>
          <div className="stat-value">{pets.length}</div>
          <div className="stat-label">Total Pets</div>
        </div>
      </div>

      {/* Quick Actions */}
      {pets.length > 0 && (
        <div className="card">
          <h3 className="card-header">View by Pet</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {pets.map(pet => (
              <button
                key={pet.petId}
                className="btn btn-secondary"
                onClick={() => navigate(`/pets/${pet.petId}/expenses`)}
              >
                {pet.petName}'s Expenses
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="card">
        <h3 className="card-header">All Expense Records</h3>
        
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No expenses recorded yet.</p>
            {pets.length === 0 ? (
              <div>
                <p style={{ color: '#999', marginTop: '1rem' }}>
                  You need to add a pet first before tracking expenses.
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate('/pets')}
                  style={{ marginTop: '1rem' }}
                >
                  Add Your First Pet
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={openAddModal}>
                Add First Expense
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const categoryInfo = categories[expense.category];
                  return (
                    <tr key={expense.expenseId}>
                      <td><strong>{getPetName(expense.petId)}</strong></td>
                      <td>{expense.month}</td>
                      <td>
                        <span 
                          className="category-badge" 
                          style={{ 
                            backgroundColor: `${categoryInfo?.color}20`,
                            color: categoryInfo?.color,
                            border: `1px solid ${categoryInfo?.color}`
                          }}
                        >
                          {categoryInfo?.icon} {categoryInfo?.label}
                        </span>
                      </td>
                      <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                      <td>{expense.description || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handleEdit(expense)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm" 
                            onClick={() => handleDelete(expense.expenseId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Expense Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
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
                      {pet.petName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  {Object.entries(categories).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.icon} {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount (LKR) *</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="e.g., 1500.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="month">Month *</label>
                <input
                  type="month"
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Add any notes about this expense..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllExpenses;

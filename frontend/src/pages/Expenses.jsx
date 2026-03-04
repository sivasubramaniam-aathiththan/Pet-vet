import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expenseAPI, petAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Expense Tracking Page
 * 
 * Allows users to:
 * - View all expenses for a specific pet
 * - Add new expenses
 * - Edit existing expenses
 * - Delete expenses
 * - View monthly and category summaries
 */
const Expenses = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: '',
    description: ''
  });

  useEffect(() => {
    if (petId) {
      fetchPetDetails();
      fetchExpenses();
      fetchSummaries();
    }
  }, [petId]);

  const fetchPetDetails = async () => {
    try {
      const response = await petAPI.getById(petId);
      setPet(response.data.data);
    } catch (error) {
      toast.error('Failed to load pet details');
      console.error('Error fetching pet:', error);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getByPet(petId);
      setExpenses(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load expenses');
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaries = async () => {
    try {
      const [monthlyRes, categoryRes, totalRes] = await Promise.all([
        expenseAPI.getMonthlySummary(petId),
        expenseAPI.getCategorySummary(petId),
        expenseAPI.getTotal(petId)
      ]);

      setMonthlySummary(monthlyRes.data.data || []);
      setCategorySummary(categoryRes.data.data || []);
      setTotalExpense(totalRes.data.data || 0);
    } catch (error) {
      console.error('Error fetching summaries:', error);
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
      const expenseData = {
        ...formData,
        petId: parseInt(petId),
        amount: parseFloat(formData.amount)
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
      fetchExpenses();
      fetchSummaries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save expense');
      console.error('Error saving expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
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
      fetchExpenses();
      fetchSummaries();
    } catch (error) {
      toast.error('Failed to delete expense');
      console.error('Error deleting expense:', error);
    }
  };

  const resetForm = () => {
    setFormData({
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      FOOD: '🍖',
      MEDICAL: '💊',
      GROOMING: '✂️',
      TOYS: '🎾',
      TRAINING: '🎓',
      OTHER: '📦'
    };
    return icons[category] || '📦';
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
          <button className="btn btn-secondary" onClick={() => navigate('/pets')}>
            ← Back to Pets
          </button>
          <h1>Expense Tracking - {pet?.petName}</h1>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(totalExpense)}</div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-label">Total Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categorySummary.length}</div>
          <div className="stat-label">Categories Used</div>
        </div>
      </div>

      {/* Category Summary */}
      {categorySummary.length > 0 && (
        <div className="card">
          <h3 className="card-header">Expenses by Category</h3>
          <div className="category-summary">
            {categorySummary.map((item, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <span className="category-icon">{getCategoryIcon(item.category)}</span>
                  <span className="category-name">{item.category}</span>
                </div>
                <div className="category-amount">{formatCurrency(item.total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Summary */}
      {monthlySummary.length > 0 && (
        <div className="card">
          <h3 className="card-header">Monthly Expenses</h3>
          <div className="monthly-summary">
            {monthlySummary.map((item, index) => (
              <div key={index} className="monthly-item">
                <div className="month-name">{item.month}</div>
                <div className="month-amount">{formatCurrency(item.total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="card">
        <h3 className="card-header">All Expenses</h3>
        
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No expenses recorded yet.</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Add First Expense
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.expenseId}>
                    <td>{expense.month}</td>
                    <td>
                      <span className="category-badge">
                        {getCategoryIcon(expense.category)} {expense.category}
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
                ))}
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
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="FOOD">🍖 Food</option>
                  <option value="MEDICAL">💊 Medical</option>
                  <option value="GROOMING">✂️ Grooming</option>
                  <option value="TOYS">🎾 Toys</option>
                  <option value="TRAINING">🎓 Training</option>
                  <option value="OTHER">📦 Other</option>
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

export default Expenses;

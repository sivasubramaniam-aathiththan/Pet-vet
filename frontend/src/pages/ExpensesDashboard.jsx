import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expenseAPI, petAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Enhanced Expense Dashboard with Category-wise Analysis
 * 
 * Features:
 * - Category-wise expense breakdown with visual bars
 * - Percentage distribution
 * - Monthly trends
 * - Add/Edit/Delete expenses
 * - Filter by category
 */
const ExpensesDashboard = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: '',
    description: ''
  });

  // Category configuration with colors and icons
  const categories = {
    FOOD: { icon: '🍖', label: 'Food', color: '#FF6B6B' },
    MEDICAL: { icon: '💊', label: 'Medical', color: '#4ECDC4' },
    GROOMING: { icon: '✂️', label: 'Grooming', color: '#95E1D3' },
    TOYS: { icon: '🎾', label: 'Toys', color: '#FFE66D' },
    TRAINING: { icon: '🎓', label: 'Training', color: '#A8E6CF' },
    OTHER: { icon: '📦', label: 'Other', color: '#C7CEEA' }
  };

  useEffect(() => {
    if (petId) {
      fetchPetDetails();
      fetchExpenses();
      fetchSummaries();
    }
  }, [petId]);

  useEffect(() => {
    // Filter expenses when category changes
    if (selectedCategory === 'ALL') {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter(exp => exp.category === selectedCategory));
    }
  }, [selectedCategory, expenses]);

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
      setFilteredExpenses(response.data.data || []);
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
      
      // Transform category summary to include metadata
      const categoryData = (categoryRes.data.data || []).map(item => ({
        category: item.category || item[0],
        total: item.total || item[1],
        ...categories[item.category || item[0]]
      }));
      setCategorySummary(categoryData);
      
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
      // Convert month (YYYY-MM) to expenseDate (YYYY-MM-01)
      const expenseDate = formData.month ? `${formData.month}-01` : null;
      
      const expenseData = {
        petId: parseInt(petId),
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
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculatePercentage = (amount) => {
    if (totalExpense === 0) return 0;
    return ((amount / totalExpense) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading expense data...</p>
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
          <h1>Expense Dashboard - {pet?.petName}</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Track and analyze your pet's expenses by category
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
          <div className="stat-value">{formatCurrency(totalExpense)}</div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-label">Total Records</div>
        </div>
        <div className="stat-card stat-card-info">
          <div className="stat-icon">📁</div>
          <div className="stat-value">{categorySummary.length}</div>
          <div className="stat-label">Active Categories</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{monthlySummary.length}</div>
          <div className="stat-label">Months Tracked</div>
        </div>
      </div>

      {/* Category-wise Breakdown */}
      <div className="card">
        <h3 className="card-header">
          <span>📊 Category-wise Expense Analysis</span>
        </h3>
        
        {categorySummary.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            <p>No expenses recorded yet. Add your first expense to see the breakdown.</p>
          </div>
        ) : (
          <div className="category-analysis">
            {categorySummary.map((item, index) => {
              const percentage = calculatePercentage(item.total);
              return (
                <div key={index} className="category-analysis-item">
                  <div className="category-header">
                    <div className="category-info">
                      <span className="category-icon-large" style={{ color: item.color }}>
                        {item.icon}
                      </span>
                      <div>
                        <div className="category-name">{item.label}</div>
                        <div className="category-count">
                          {expenses.filter(e => e.category === item.category).length} transactions
                        </div>
                      </div>
                    </div>
                    <div className="category-amount-section">
                      <div className="category-amount">{formatCurrency(item.total)}</div>
                      <div className="category-percentage">{percentage}%</div>
                    </div>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Trends */}
      {monthlySummary.length > 0 && (
        <div className="card">
          <h3 className="card-header">📈 Monthly Expense Trends</h3>
          <div className="monthly-trends">
            {monthlySummary.map((item, index) => {
              const monthTotal = item.total || item[1];
              const monthName = item.month || item[0];
              const maxAmount = Math.max(...monthlySummary.map(m => m.total || m[1]));
              const barHeight = (monthTotal / maxAmount) * 100;
              
              return (
                <div key={index} className="monthly-trend-item">
                  <div className="monthly-bar-container">
                    <div 
                      className="monthly-bar" 
                      style={{ height: `${barHeight}%` }}
                      title={formatCurrency(monthTotal)}
                    ></div>
                  </div>
                  <div className="monthly-amount">{formatCurrency(monthTotal)}</div>
                  <div className="monthly-label">{monthName}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expense List with Category Filter */}
      <div className="card">
        <div className="card-header-with-filter">
          <h3>📝 Expense Records</h3>
          <div className="category-filter">
            <label>Filter by Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Categories</option>
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.icon} {value.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>
              {selectedCategory === 'ALL' 
                ? 'No expenses recorded yet.' 
                : `No expenses in ${categories[selectedCategory]?.label} category.`}
            </p>
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
                {filteredExpenses.map((expense) => {
                  const categoryInfo = categories[expense.category];
                  return (
                    <tr key={expense.expenseId}>
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

export default ExpensesDashboard;

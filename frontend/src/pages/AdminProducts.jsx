import { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Admin Products Management Page
 * 
 * Allows admin to:
 * - View all products
 * - Create new products with e-commerce links
 * - Edit existing products
 * - Delete products
 * - Toggle product active status
 */
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    externalEcommerceLink: '',
    imageUrl: '',
    category: '',
    brand: '',
    price: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value ? parseFloat(value) : '') : value
    }));
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      description: '',
      externalEcommerceLink: '',
      imageUrl: '',
      category: '',
      brand: '',
      price: ''
    });
    setEditingProduct(null);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description || '',
      externalEcommerceLink: product.externalEcommerceLink,
      imageUrl: product.imageUrl || '',
      category: product.category || '',
      brand: product.brand || '',
      price: product.price || ''
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.productName.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.externalEcommerceLink.trim()) {
      toast.error('External e-commerce link is required');
      return;
    }

    if (formData.price && formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    try {
      const submissionData = {
        productName: formData.productName,
        description: formData.description,
        externalEcommerceLink: formData.externalEcommerceLink,
        imageUrl: formData.imageUrl,
        category: formData.category,
        brand: formData.brand,
        price: formData.price ? parseFloat(formData.price) : null
      };

      if (editingProduct) {
        await productAPI.update(editingProduct.productId, submissionData);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.create(submissionData);
        toast.success('Product created successfully!');
      }

      closeModal();
      fetchProducts();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save product';
      toast.error(errorMessage);
      console.error('Error:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productAPI.delete(productId);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error:', error);
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      await productAPI.toggleStatus(productId);
      toast.success('Product status updated!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product status');
      console.error('Error:', error);
    }
  };

  const filteredProducts = filterStatus === 'ALL'
    ? products
    : products.filter(p => (filterStatus === 'ACTIVE' ? p.isActive : !p.isActive));

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>📦 Product Management</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Create and manage pet product recommendations
          </p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={openCreateModal}>
          + Add New Product
        </button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{products.filter(p => p.isActive).length}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-icon">⏸️</div>
          <div className="stat-value">{products.filter(p => !p.isActive).length}</div>
          <div className="stat-label">Inactive</div>
        </div>
        <div className="stat-card stat-card-info">
          <div className="stat-icon">🏷️</div>
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: '500' }}>Filter by Status:</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'ACTIVE', 'INACTIVE'].map(status => (
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

      {/* Products Table */}
      <div className="card">
        <h3 className="card-header">📋 Products List</h3>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              {products.length === 0
                ? 'No products yet. Create your first product!'
                : `No ${filterStatus.toLowerCase()} products.`}
            </p>
            {products.length === 0 && (
              <button className="btn btn-primary" onClick={openCreateModal}>
                Create First Product
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>E-commerce Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.productId}>
                    <td>
                      <strong>{product.productName}</strong>
                      {product.description && (
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                          {product.description.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td>{product.category || '-'}</td>
                    <td>{product.brand || '-'}</td>
                    <td>
                      {product.price ? (
                        <span style={{ fontWeight: 'bold', color: '#4caf50' }}>
                          ${product.price.toFixed(2)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          backgroundColor: product.isActive ? '#d4edda' : '#f8d7da',
                          color: product.isActive ? '#155724' : '#721c24'
                        }}
                      >
                        {product.isActive ? '✅ Active' : '⏸️ Inactive'}
                      </span>
                    </td>
                    <td>
                      <a
                        href={product.externalEcommerceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#1976d2',
                          textDecoration: 'none',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        View Link 🔗
                      </a>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => openEditModal(product)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn ${product.isActive ? 'btn-warning' : 'btn-success'} btn-sm`}
                          onClick={() => handleToggleStatus(product.productId)}
                          title={product.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {product.isActive ? '🔴 Deactivate' : '🟢 Activate'}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteProduct(product.productId)}
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

      {/* Create/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? '✏️ Edit Product' : '➕ Create New Product'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Product Name */}
              <div className="form-group">
                <label htmlFor="productName">Product Name *</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Dog Food"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the product features and benefits..."
                  rows="3"
                />
              </div>

              {/* E-commerce Link */}
              <div className="form-group">
                <label htmlFor="externalEcommerceLink">E-commerce Link *</label>
                <input
                  type="url"
                  id="externalEcommerceLink"
                  name="externalEcommerceLink"
                  value={formData.externalEcommerceLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/product"
                  required
                />
                <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
                  Paste the Amazon, Flipkart, or other e-commerce link here
                </small>
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Two Column Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Category */}
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="food">Food</option>
                    <option value="toys">Toys</option>
                    <option value="accessories">Accessories</option>
                    <option value="health">Health & Wellness</option>
                    <option value="grooming">Grooming</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Brand */}
                <div className="form-group">
                  <label htmlFor="brand">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Pedigree, Royal Canin"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* Modal Actions */}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

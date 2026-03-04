import { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Products Page
 * 
 * Displays pet products recommended by admin
 * Users can view products and click external e-commerce links
 */
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getActive();
      const productList = response.data.data || [];
      setProducts(productList);
      filterProducts(productList, 'ALL', '');
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      const categoryList = response.data.data || [];
      setCategories(categoryList);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterProducts = (productList, category, search) => {
    let filtered = productList;

    if (category !== 'ALL') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search.trim()) {
      filtered = filtered.filter(p =>
        p.productName.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterProducts(products, category, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterProducts(products, selectedCategory, query);
  };

  const openProduct = (product) => {
    if (product.externalEcommerceLink) {
      window.open(product.externalEcommerceLink, '_blank');
    }
  };

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
          <h1>🛍️ Pet Products</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Discover recommended pet products from trusted e-commerce partners
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="stats-grid">
        <div className="stat-card stat-card-info">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-icon">🏷️</div>
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label htmlFor="search" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Search Products
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name, brand, or description..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Filter by Category
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => handleCategoryChange('ALL')}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="card">
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>
              {products.length === 0 ? '📦 No products available yet.' : '🔍 No products match your search.'}
            </p>
            {products.length > 0 && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                style={{ marginTop: '1rem' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredProducts.map((product) => (
              <div
                key={product.productId}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f5f5f5',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '3rem' }}>📦</div>
                  )}
                </div>

                {/* Product Info */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Category Badge */}
                  {product.category && (
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        width: 'fit-content'
                      }}
                    >
                      {product.category}
                    </span>
                  )}

                  {/* Product Name */}
                  <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: '#333' }}>
                    {product.productName}
                  </h3>

                  {/* Brand */}
                  {product.brand && (
                    <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                      <strong>Brand:</strong> {product.brand}
                    </p>
                  )}

                  {/* Description */}
                  {product.description && (
                    <p style={{
                      margin: '0.5rem 0',
                      color: '#666',
                      fontSize: '0.9rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  {product.price && (
                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.3rem', color: '#4caf50', fontWeight: 'bold' }}>
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* View Product Button */}
                  <button
                    className="btn btn-primary"
                    onClick={() => openProduct(product)}
                    style={{ marginTop: '1rem', width: '100%' }}
                  >
                    View on Store 🔗
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredProducts.length > 0 && (
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}
    </div>
  );
};

export default Products;

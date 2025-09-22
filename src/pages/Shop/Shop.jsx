import React, { useContext, useState, useEffect } from 'react'
import './Shop.css'
import { StoreContext } from '../../context/StoreContext'
import ProductItem from '../../components/ProductItem/ProductItem'
import { assets } from '../../assets/assets'

const Shop = () => {
  const { product_list } = useContext(StoreContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(16)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: '', max: '' },
    sortBy: 'default',
    inStock: false
  })
  const [filteredProducts, setFilteredProducts] = useState([])

  // Get unique categories from products
  const categories = [...new Set(product_list.map(product => product.category))].filter(Boolean)

  // Filter and sort products
  useEffect(() => {
    let filtered = [...product_list]

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Filter by price range
    if (filters.priceRange.min !== '') {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.priceRange.min))
    }
    if (filters.priceRange.max !== '') {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.priceRange.max))
    }

    // Filter by stock
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0)
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        // Keep original order
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [product_list, filters])

  // Calculate pagination using filtered products
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value) || 16
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: { min: '', max: '' },
      sortBy: 'default',
      inStock: false
    })
  }

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu)
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  return (
    <div className="shop-page">
      <section className="shop-hero">
        <div className="shop-hero-overlay">
          <h1>Shop</h1>
          <div className="breadcrumb">
            <span>
              <span>Home</span>
              <span className="chev"> › </span>
              <span className="current">Shop</span>
            </span>
          </div>
        </div>
      </section>

      <div className="shop-toolbar">
        <div className="toolbar-left">
          <div className="filter-section" onClick={toggleFilterMenu}>
            <img src={assets.filter_icon} alt="Filter" className="filter-icon" />
            <span className="label">Filter</span>
          </div>
          <span className="divider"></span>
          <div className="view-icons">
            <img 
              src={assets.grid_icon} 
              alt="Grid View" 
              className={`view-icon ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
            />
            <img 
              src={assets.list_icon} 
              alt="List View" 
              className={`view-icon ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('list')}
            />
          </div>
          <span className="toolbar-sep"></span>
          <span className="results-text">Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} results</span>
        </div>
        <div className="toolbar-right">
          <div className="show-box">
            <span>Show</span>
            <input 
              type="number" 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              min="1"
              max={totalItems}
            />
          </div>
          <div className="sort-box">
            <span>Sort by</span>
            <select 
              value={filters.sortBy} 
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Menu */}
      {showFilterMenu && (
        <div className="filter-overlay" onClick={() => setShowFilterMenu(false)}>
          <div className="filter-menu" onClick={(e) => e.stopPropagation()}>
            <div className="filter-header">
              <h3>Filter Products</h3>
              <button className="close-filter" onClick={() => setShowFilterMenu(false)}>×</button>
            </div>
            
            <div className="filter-content">
              {/* Category Filter */}
              <div className="filter-group">
                <h4>Category</h4>
                <select 
                  value={filters.category} 
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Filter Actions */}
              <div className="filter-actions">
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
                <button className="apply-filters-btn" onClick={() => setShowFilterMenu(false)}>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`shop-grid ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
        {currentProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            stock={item.stock || 0}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages && (
            <button className="pagination-btn next-btn" onClick={handleNextPage}>
              Next
            </button>
          )}
        </div>
      )}

      {/* Features Section */}
      <div className="shop-features">
        <div className="feature-item">
          <img src={assets.vector_icon} alt="Free Shipping" />
          <div className="feature-text">
            <h3>Free Shipping</h3>
            <p>Free shipping on all your order</p>
          </div>
        </div>
        <div className="feature-item">
          <img src={assets.shipping_icon} alt="Customer Support" />
          <div className="feature-text">
            <h3>Customer Support</h3>
            <p>We support online 24 hours a day</p>
          </div>
        </div>
        <div className="feature-item">
          <img src={assets.group_icon} alt="Secure Payment" />
          <div className="feature-text">
            <h3>Secure Payment</h3>
            <p>100% secure payment</p>
          </div>
        </div>
        <div className="feature-item">
          <img src={assets.trophy_icon} alt="Money Back" />
          <div className="feature-text">
            <h3>Money Back</h3>
            <p>Return back within 30 days</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop



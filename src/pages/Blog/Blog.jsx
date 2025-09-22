import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import './Blog.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'

const Blog = () => {
  const { url } = useContext(StoreContext)
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const [recentPosts, setRecentPosts] = useState([])

  const postsPerPage = 3

  useEffect(() => {
    fetchBlogPosts()
    fetchCategories()
    fetchRecentPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(`${url}/api/blog/list`)
      const result = await response.json()
      
      if (result.success) {
        setBlogPosts(result.data)
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url}/api/blog/categories`)
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch(`${url}/api/blog/recent`)
      const result = await response.json()
      
      if (result.success) {
        setRecentPosts(result.data)
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="blog-page">
        <div className="loading">Loading blog posts...</div>
      </div>
    )
  }

  return (
    <div className="blog-page">
      {/* Header Banner */}
      <section className="blog-hero">
        <div className="hero-overlay">
          <h1>Blog</h1>
          <div className="breadcrumb">
            <span>
              <Link to="/">Home</Link>
              <span className="chev"> › </span>
              <span className="current">Blog</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="blog-container">
        <div className="blog-content">
          {/* Left Column - Blog Posts */}
          <div className="blog-posts">
            {currentPosts.length === 0 ? (
              <div className="no-posts">
                <p>No blog posts found</p>
              </div>
            ) : (
              currentPosts.map((post) => (
                <article key={post._id} className="blog-post">
                  <div className="post-image">
                    <img src={`${url}/images/${post.image}`} alt={post.title} />
                  </div>
                  <div className="post-meta">
                    <span className="author">Admin</span>
                    <span className="date">{formatDate(post.createdAt)}</span>
                    <span className="category">{post.category}</span>
                  </div>
                  <h2 className="post-title">{post.title}</h2>
                  <div className="post-excerpt">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </div>
                  <Link to={`/blog/${post._id}`} className="read-more">
                    Read more
                  </Link>
                </article>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="page-btn"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  className="page-btn"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="blog-sidebar">
            {/* Search */}
            <div className="sidebar-section">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <img src={assets.search_icon} alt="Search" />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="sidebar-section">
              <h3>Categories</h3>
              <ul className="category-list">
                <li>
                  <button 
                    className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    All ({blogPosts.length})
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category._id}>
                    <button 
                      className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name} ({category.count})
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="sidebar-section">
              <h3>Recent Posts</h3>
              <div className="recent-posts">
                {recentPosts.map((post) => (
                  <div key={post._id} className="recent-post">
                    <div className="recent-post-image">
                      <img src={`${url}/images/${post.image}`} alt={post.title} />
                    </div>
                    <div className="recent-post-content">
                      <h4>
                        <Link to={`/blog/${post._id}`}>{post.title}</Link>
                      </h4>
                      <p className="recent-post-date">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="blog-features">
        <div className="feature-item">
          <img src={assets.trophy_icon} alt="High Quality" />
          <div className="feature-text">
            <h3>High Quality</h3>
            <p>crafted from top materials</p>
          </div>
        </div>
        <div className="feature-item">
          <img src={assets.group_icon} alt="Warranty Protection" />
          <div className="feature-text">
            <h3>Warranty Protection</h3>
            <p>Over 2 years</p>
          </div>
        </div>
        <div className="feature-item">
          <img src={assets.shipping_icon} alt="Free Shipping" />
          <div className="feature-text">
            <h3>Free Shipping</h3>
            <p>Order over 150 $</p>
          </div>
        </div>
        <div className="feature-item">
          <img src={assets.vector_icon} alt="24/7 Support" />
          <div className="feature-text">
            <h3>24/7 Support</h3>
            <p>Dedicated support</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog

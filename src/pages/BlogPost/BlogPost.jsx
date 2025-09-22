import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import './BlogPost.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'

const BlogPost = () => {
  const { url } = useContext(StoreContext)
  const { id } = useParams()
  const [blogPost, setBlogPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState([])

  useEffect(() => {
    fetchBlogPost()
    fetchRelatedPosts()
  }, [id])

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`${url}/api/blog/${id}`)
      const result = await response.json()
      
      if (result.success) {
        setBlogPost(result.data)
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async () => {
    try {
      const response = await fetch(`${url}/api/blog/list`)
      const result = await response.json()
      
      if (result.success) {
        // Get 3 random related posts (excluding current post)
        const filtered = result.data.filter(post => post._id !== id)
        const shuffled = filtered.sort(() => 0.5 - Math.random())
        setRelatedPosts(shuffled.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const shareOnSocialMedia = (platform) => {
    const postUrl = window.location.href
    const title = blogPost?.title || 'Check out this blog post'
    
    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + postUrl)}`
        break
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="loading">Loading blog post...</div>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="blog-post-page">
        <div className="error">
          <h2>Blog post not found</h2>
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      {/* Header Banner */}
      <section className="blog-post-hero">
        <div className="hero-overlay">
          <h1>{blogPost.title}</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="chev">›</span>
            <Link to="/blog">Blog</Link>
            <span className="chev">›</span>
            <span className="current">{blogPost.title}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="blog-post-container">
        <div className="blog-post-content">
          {/* Left Column - Main Content */}
          <div className="blog-post-main">
            {/* Blog Post Header */}
            <div className="blog-post-header">
              <div className="post-meta">
                <span className="author">By {blogPost.author}</span>
                <span className="date">{formatDate(blogPost.createdAt)}</span>
                <span className="category">{blogPost.category}</span>
                <span className="views">{blogPost.views} views</span>
              </div>
            </div>

            {/* Blog Post Image */}
            <div className="blog-post-image">
              <img src={`${url}/images/${blogPost.image}`} alt={blogPost.title} />
            </div>

            {/* Blog Post Content */}
            <div className="blog-post-body">
              {blogPost.excerpt && (
                <div className="blog-excerpt">
                  <p>{blogPost.excerpt}</p>
                </div>
              )}
              
              <div className="blog-content">
                {blogPost.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="blog-share-section">
              <h3>Share this post</h3>
              <div className="share-buttons">
                <button 
                  className="share-btn facebook"
                  onClick={() => shareOnSocialMedia('facebook')}
                  title="Share on Facebook"
                >
                  <span>Facebook</span>
                </button>
                <button 
                  className="share-btn twitter"
                  onClick={() => shareOnSocialMedia('twitter')}
                  title="Share on Twitter"
                >
                  <span>Twitter</span>
                </button>
                <button 
                  className="share-btn linkedin"
                  onClick={() => shareOnSocialMedia('linkedin')}
                  title="Share on LinkedIn"
                >
                  <span>LinkedIn</span>
                </button>
                <button 
                  className="share-btn whatsapp"
                  onClick={() => shareOnSocialMedia('whatsapp')}
                  title="Share on WhatsApp"
                >
                  <span>WhatsApp</span>
                </button>
                <button 
                  className="share-btn copy"
                  onClick={copyToClipboard}
                  title="Copy Link"
                >
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="blog-post-sidebar">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="sidebar-section">
                <h3>Related Posts</h3>
                <div className="related-posts">
                  {relatedPosts.map((post) => (
                    <div key={post._id} className="related-post">
                      <div className="related-post-image">
                        <img src={`${url}/images/${post.image}`} alt={post.title} />
                      </div>
                      <div className="related-post-content">
                        <h4>
                          <Link to={`/blog/${post._id}`}>{post.title}</Link>
                        </h4>
                        <p className="related-post-date">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="sidebar-section">
              <h3>Categories</h3>
              <ul className="category-list">
                <li><Link to="/blog">All Posts</Link></li>
                <li><Link to="/blog?category=Design">Design</Link></li>
                <li><Link to="/blog?category=Crafts">Crafts</Link></li>
                <li><Link to="/blog?category=Handmade">Handmade</Link></li>
                <li><Link to="/blog?category=Interior">Interior</Link></li>
                <li><Link to="/blog?category=Wood">Wood</Link></li>
              </ul>
            </div>

            {/* Back to Blog */}
            <div className="sidebar-section">
              <Link to="/blog" className="back-to-blog-btn">
                ← Back to All Posts
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="blog-post-features">
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

export default BlogPost

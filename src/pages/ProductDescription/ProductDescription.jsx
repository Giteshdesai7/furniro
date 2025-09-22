import React, { useContext, useState, useEffect } from 'react'
import ReviewsSection from './ReviewsSection.jsx'
import './ProductDescription.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'
import { useParams, useNavigate } from 'react-router-dom'

const ProductDescription = () => {
  const { product_list, addToCart, url } = useContext(StoreContext)
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [reviewsCount, setReviewsCount] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [avgRating, setAvgRating] = useState(0)

  // Find the product by ID (may be undefined on first render before data loads)
  const product = product_list.find(item => item._id === id)



  // Get all product images (primary + additional)
  const productImages = product ? [
    product.image,
    ...(product.additionalImages || [])
  ] : []

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    addToCart(product._id, selectedColor, selectedSize)
  }

  const handleCompare = () => {
    // Navigate to comparison page with the current product
    navigate(`/compare?product=${product._id}`)
  }

  const handleSocialShare = (platform) => {
    const productUrl = window.location.href
    const productTitle = product.name
    const productDescription = product.description

    let shareUrl = ''

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
        break
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy the link
        navigator.clipboard.writeText(productUrl)
        alert('Product link copied to clipboard! You can now paste it in Instagram.')
        return
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${productTitle} - ${productUrl}`)}`
        break
      default:
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  // Load review summary on mount/refresh so stars show even if Reviews tab not opened
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${url}/api/reviews/${id}`)
        const data = await res.json()
        if (data.success) {
          const list = data.data || []
          const count = list.length
          const avg = count ? Math.round((list.reduce((s, r) => s + (r.rating || 0), 0) / count) * 10) / 10 : 0
          setReviewsCount(count)
          setAvgRating(avg)
        }
      } catch (e) {
        // ignore network errors for summary
      }
    }
    fetchSummary()
  }, [id, url])

  const handleCopyLink = () => {
    const productUrl = window.location.href
    navigator.clipboard.writeText(productUrl)
    alert('Product link copied to clipboard!')
  }

  // Use dynamic sizes from product or fallback to default sizes
  const sizeOptions = product && product.availableSizes && product.availableSizes.length > 0 
    ? product.availableSizes
    : ['L', 'XL', 'XS']
  
  // Use dynamic colors from product or fallback to default colors
  const colorOptions = product && product.availableColors && product.availableColors.length > 0 
    ? product.availableColors 
    : [
        { name: 'brown', color: '#8B4513' },
        { name: 'black', color: '#000000' },
        { name: 'blue', color: '#4169E1' }
      ]

  // Set initial selected size and color when product loads
  useEffect(() => {
    if (sizeOptions.length > 0 && !selectedSize) {
      setSelectedSize(sizeOptions[0])
    }
    if (colorOptions.length > 0 && !selectedColor) {
      setSelectedColor(colorOptions[0].color)
    }
  }, [sizeOptions, selectedSize, colorOptions, selectedColor])

  return (
    <div className="product-description-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="breadcrumb">
          <span>
            <span>Home</span>
            <span className="chev"> › </span>
            <span>Shop</span>
            <span className="chev"> › </span>
            <span className="current">{product ? product.name : 'Loading...'}</span>
          </span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="product-main">
        {product ? (
          <div className="product-images">
            <div className="image-thumbnails">
              {productImages.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={`http://localhost:4000/images/${image}`} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="main-image">
              {productImages[selectedImage] && (
                <img src={`http://localhost:4000/images/${productImages[selectedImage]}`} alt={product.name} />
              )}
            </div>
          </div>
        ) : (
          <div style={{padding: '40px'}}>Loading product...</div>
        )}

         <div className="product-details">
           <h1 className="product-name">{product ? product.name : ''}</h1>
           
           <div className="product-price">
             <span className="current-price">Rs. {product?.price?.toLocaleString()}</span>
           </div>

          <div className="product-rating">
            <div className="stars">
              {[1,2,3,4,5].map((i) => (
                <span key={i} className={`star ${i <= Math.round(avgRating) ? 'filled' : ''}`}>★</span>
              ))}
            </div>
            <span className="rating-number">{avgRating || 0}</span>
            <span className="separator">|</span>
            <span className="review-count">{reviewsCount} Review{reviewsCount === 1 ? '' : 's'}</span>
          </div>

           <p className="product-short-description">
             {product ? product.description : ''}
           </p>

          <div className="product-options">
            <div className="size-options">
              <label>Size</label>
              <div className="size-buttons">
                {sizeOptions.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="color-options">
              <label>Color</label>
              <div className="color-swatches">
                {colorOptions.map(color => (
                  <button
                    key={color.name}
                    className={`color-swatch ${selectedColor === color.color ? 'active' : ''}`}
                    style={{ backgroundColor: color.color }}
                    onClick={() => setSelectedColor(color.color)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="quantity-and-actions">
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>

            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add To Cart
              </button>
              <button className="compare-btn" onClick={handleCompare}>
                + Compare
              </button>
            </div>
          </div>

           {/* Product SKU, Category, Tags and Share */}
           <div className="product-meta">
             <div className="product-category">
               <span className="meta-label">Category:</span>
               <span className="meta-value">{product ? (product.category || 'Not specified') : ''}</span>
             </div>
             <div className="product-sku">
               <span className="meta-label">SKU:</span>
               <span className="meta-value">{product ? (product.sku || `SKU-${product._id.slice(-6).toUpperCase()}`) : ''}</span>
             </div>
             <div className="product-tags">
               <span className="meta-label">Tags:</span>
               <span className="meta-value">
                 {product && product.tags && product.tags.length > 0 
                   ? product.tags.join(', ') 
                   : `${product ? (product.category || 'Furniture') : 'Furniture'}, Home, Shop`
                 }
               </span>
             </div>
             <div className="product-share">
               <p className="share-label">Share:</p>
               <div className="social-share-buttons">
                 <button 
                   className="share-btn facebook" 
                   onClick={() => handleSocialShare('facebook')}
                   title="Share on Facebook"
                 >
                   <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" />
                 </button>
                 <button 
                   className="share-btn instagram" 
                   onClick={() => handleSocialShare('instagram')}
                   title="Share on Instagram"
                 >
                   <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" />
                 </button>
                 <button 
                   className="share-btn whatsapp" 
                   onClick={() => handleSocialShare('whatsapp')}
                   title="Share on WhatsApp"
                 >
                   <img src="https://cdn-icons-png.flaticon.com/512/174/174879.png" alt="WhatsApp" />
                 </button>
                 <button 
                   className="share-btn copy-link" 
                   onClick={handleCopyLink}
                   title="Copy Product Link"
                 >
                   <img src="https://cdn-icons-png.flaticon.com/512/1621/1621635.png" alt="Copy Link" />
                 </button>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="product-tabs">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab-btn ${activeTab === 'additional' ? 'active' : ''}`}
            onClick={() => setActiveTab('additional')}
          >
            Additional Information
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews [{reviewsCount}]
          </button>
        </div>

        <div className="tab-content">
           {activeTab === 'description' && (
             <div className="description-content">
               <p>
                 {product?.detailedDescription || "No detailed description available. Please add content in the admin panel."}
               </p>
               <div className="description-images">
                 {product?.descriptionImage1 ? (
                   <img src={`http://localhost:4000/images/${product.descriptionImage1}`} alt="Product detail 1" />
                 ) : (
                   product?.image ? <img src={`http://localhost:4000/images/${product.image}`} alt="Product detail 1" /> : null
                 )}
                 {product?.descriptionImage2 ? (
                   <img src={`http://localhost:4000/images/${product.descriptionImage2}`} alt="Product detail 2" />
                 ) : (
                   product?.image ? <img src={`http://localhost:4000/images/${product.image}`} alt="Product detail 2" /> : null
                 )}
               </div>
             </div>
           )}
          {activeTab === 'additional' && (
            <div className="additional-content">
              <p>
                {product?.additionalInformation || "No additional information available. Please add content in the admin panel."}
              </p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="reviews-content">
              <ReviewsSection productId={id} onCountChange={setReviewsCount} onSummaryChange={({count, average})=>{ setReviewsCount(count); setAvgRating(average); }} />
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products">
        <h2>Related Products</h2>
        <div className="related-products-grid">
          {product_list.slice(0, 4).map((item, index) => (
            <div key={item._id} className="related-product-card" onClick={() => navigate(`/product/${item._id}`)}>
              <div className="product-image-container">
                <img src={`http://localhost:4000/images/${item.image}`} alt={item.name} />
                {index === 0 && <div className="discount-badge">-30%</div>}
                {index === 2 && <div className="discount-badge">-50%</div>}
                {index === 3 && <div className="new-badge">New</div>}
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="related-price">
                <span className="current-price">Rp {item.price?.toLocaleString()}</span>
                {(index === 0 || index === 2) && (
                  <span className="old-price">Rp {Math.round(item.price * 1.4)?.toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="show-more-btn">Show More</button>
      </div>
    </div>
  )
}

export default ProductDescription

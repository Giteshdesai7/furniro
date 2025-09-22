import React, { useContext } from 'react'
import './Like.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Like = () => {
  const { likedItems, product_list, url, toggleLike } = useContext(StoreContext)
  const navigate = useNavigate()

  // Get liked products with full product details
  const getLikedProducts = () => {
    return product_list.filter(product => likedItems[product._id])
  }

  const likedProducts = getLikedProducts()

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const handleLikeClick = (e, productId) => {
    e.stopPropagation()
    toggleLike(productId)
  }

  return (
    <div className='like-page'>
      <div className="like-header">
        <h2>My Wishlist</h2>
        <p>{likedProducts.length} {likedProducts.length === 1 ? 'item' : 'items'} in your wishlist</p>
      </div>
      
      <div className="like-content">
        {likedProducts.length === 0 ? (
          <div className="empty-wishlist">
            <img src={assets.heart_icon} alt="Empty wishlist" className="empty-icon" />
            <h3>Your wishlist is empty</h3>
            <p>Start adding products you love to your wishlist!</p>
            <button className="shop-now-btn" onClick={() => navigate('/shop')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {likedProducts.map((product) => (
              <div key={product._id} className="wishlist-item" onClick={() => handleProductClick(product._id)}>
                <div className="wishlist-item-image-container">
                  <img 
                    className='wishlist-item-image' 
                    src={`${url}/images/${product.image}`} 
                    alt={product.name} 
                  />
                  
                  {/* Like button */}
                  <button 
                    className={`like-button ${likedItems[product._id] ? 'liked' : ''}`}
                    onClick={(e) => handleLikeClick(e, product._id)}
                  >
                    <img src={assets.heart_icon} alt="Like" className="heart-icon" />
                  </button>
                  
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="product-badge discount-badge">
                      -{product.discount}%
                    </div>
                  )}
                  
                  {/* New Badge */}
                  {product.isNew && (
                    <div className="product-badge new-badge">
                      New
                    </div>
                  )}
                </div>
                
                <div className="wishlist-item-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-pricing">
                    <span className="current-price">Rp {product.price?.toLocaleString()}</span>
                    {product.discount && (
                      <span className="original-price">
                        Rp {Math.round(product.price / (1 - product.discount/100))?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Like

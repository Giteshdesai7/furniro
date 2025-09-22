import React from 'react'
import './Cart.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext.jsx'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Cart = () => {
  const { cartItems, product_list, removeFromCart, getTotalCartAmount, url, addToCart } = useContext(StoreContext)
  const navigate = useNavigate()

  // Get cart items with product details
  const getCartItemsWithDetails = () => {
    return Object.keys(cartItems).map(cartKey => {
      // Extract itemId, color, and size from cartKey (format: itemId_color_size)
      const [itemId, color, size] = cartKey.split('_');
      const product = product_list.find(p => p._id === itemId)
      return {
        ...product,
        quantity: cartItems[cartKey],
        selectedColor: color !== 'default' ? color : null,
        selectedSize: size !== 'default' ? size : null,
        cartKey: cartKey
      }
    }).filter(item => item && item.quantity > 0)
  }

  const cartItemsWithDetails = getCartItemsWithDetails()

  // Helper function to get color name from color value
  const getColorName = (colorValue) => {
    const colorMap = {
      '#8B4513': 'Brown',
      '#000000': 'Black', 
      '#4169E1': 'Blue',
      '#FF0000': 'Red',
      '#00FF00': 'Green',
      '#FFFF00': 'Yellow',
      '#FF00FF': 'Magenta',
      '#00FFFF': 'Cyan',
      '#FFFFFF': 'White',
      '#808080': 'Gray'
    }
    return colorMap[colorValue] || colorValue
  }

  const handleQuantityChange = (cartKey, newQuantity) => {
    const quantity = parseInt(newQuantity) || 1
    
    if (quantity <= 0) {
      removeFromCart(cartKey)
    } else {
      // Remove current quantity and add new quantity
      const currentQuantity = cartItems[cartKey] || 0
      const difference = quantity - currentQuantity
      
      if (difference > 0) {
        // Add the difference
        for (let i = 0; i < difference; i++) {
          // Extract itemId, color, and size from cartKey
          const [itemId, color, size] = cartKey.split('_');
          addToCart(itemId, color !== 'default' ? color : null, size !== 'default' ? size : null)
        }
      } else if (difference < 0) {
        // Remove the difference
        for (let i = 0; i < Math.abs(difference); i++) {
          removeFromCart(cartKey)
        }
      }
    }
  }

  return (
    <div className='cart-page'>
      {/* Header Banner */}
      <section className="cart-hero">
        <div className="hero-overlay">
          <div className="logo-container">
            <img src={assets.logo} alt="Furniro Logo" className="hero-logo" />
          </div>
          <h1>Cart</h1>
          <div className="breadcrumb" aria-label="Breadcrumb">
            <span>Home</span>
            <span className="chev">&gt;</span>
            <span className="current">Cart</span>
          </div>
        </div>
      </section>

      {/* Main Cart Content */}
      <div className="cart-container">
        <div className="cart-content">
          {/* Left Panel - Product List */}
          <div className="cart-items-panel">
            <div className="cart-table">
              <div className="table-header">
                <div className="header-cell product-col">Product</div>
                <div className="header-cell price-col">Price</div>
                <div className="header-cell quantity-col">Quantity</div>
                <div className="header-cell subtotal-col">Subtotal</div>
              </div>
              
              {cartItemsWithDetails.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cartItemsWithDetails.map((item) => (
                  <div key={item.cartKey} className="cart-item-row">
                    <div className="product-cell">
                      <div className="product-image">
                        <img src={`${url}/images/${item.image}`} alt={item.name} />
                      </div>
                      <div className="product-info">
                        <div className="product-name">{item.name}</div>
                        {item.selectedColor && (
                          <div className="product-option">
                            <span className="option-label">Color:</span>
                            <span
                              className="color-swatch"
                              style={{ backgroundColor: item.selectedColor }}
                              title={getColorName(item.selectedColor)}
                            />
                          </div>
                        )}
                        {item.selectedSize && (
                          <div className="product-option">
                            <span className="option-label">Size:</span>
                            <span className="option-value">{item.selectedSize}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="price-cell">Rs. {item.price?.toLocaleString()}</div>
                    <div className="quantity-cell">
                      <input 
                        type="number" 
                        value={item.quantity} 
                        min="1"
                        onChange={(e) => handleQuantityChange(item.cartKey, e.target.value)}
                        className="quantity-input"
                      />
                    </div>
                    <div className="subtotal-cell">Rs. {(item.quantity * item.price)?.toLocaleString()}</div>
                    <div className="remove-cell">
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.cartKey)}
                      >
                        <img src={assets.delete_icon} alt="Remove" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Cart Totals */}
          <div className="cart-totals-panel">
            <h2>Cart Totals</h2>
            <div className="totals-details">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rs. {getTotalCartAmount()?.toLocaleString()}</span>
              </div>
              <div className="total-row final-total">
                <span>Total</span>
                <span>Rs. {getTotalCartAmount()?.toLocaleString()}</span>
              </div>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => navigate('/order')}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="cart-features">
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
            <h3>24 / 7 Support</h3>
            <p>Dedicated support</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
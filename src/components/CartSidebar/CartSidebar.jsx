import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, product_list, url, removeFromCart, getTotalCartAmount } = useContext(StoreContext)
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
  const totalAmount = getTotalCartAmount ? getTotalCartAmount() : 0

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

  const handleRemoveItem = (cartKey) => {
    removeFromCart(cartKey)
  }

  const handleCartClick = () => {
    onClose()
    navigate('/cart')
  }

  const handleCheckoutClick = () => {
    onClose()
    navigate('/order')
  }

  const handleComparisonClick = () => {
    onClose()
    navigate('/compare')
  }

  if (!isOpen) return null

  const styles = `
    .cart-sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      padding-top: 80px;
    }

    .cart-sidebar {
      background-color: #FFFFFF;
      width: 400px;
      height: calc(100vh - 80px);
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 20px;
      border-bottom: 1px solid #E8E8E8;
    }

    .cart-header h3 {
      font-size: 20px;
      font-weight: 600;
      color: #3A3A3A;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #9F9F9F;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #3A3A3A;
    }

    .cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .empty-cart {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #9F9F9F;
      font-size: 16px;
    }

    .cart-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #F5F5F5;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      flex: 1;
    }

    .item-details h4 {
      font-size: 16px;
      font-weight: 600;
      color: #3A3A3A;
      margin: 0 0 4px 0;
      line-height: 20px;
    }

    .item-details p {
      font-size: 14px;
      color: #9F9F9F;
      margin: 0;
      line-height: 18px;
    }

    .item-option .color-swatch{
      width: 12px;
      height: 12px;
      display: inline-block;
      border-radius: 50%;
      border: 1px solid #E8E8E8;
      vertical-align: middle;
      margin-left: 6px;
    }

    .remove-btn {
      background: none;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #F5F5F5;
      color: #9F9F9F;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .remove-btn:hover {
      background-color: #E8E8E8;
      color: #3A3A3A;
    }

    .cart-subtotal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-top: 1px solid #E8E8E8;
      background-color: #F9F9F9;
    }

    .cart-subtotal span:first-child {
      font-size: 16px;
      font-weight: 600;
      color: #3A3A3A;
    }

    .cart-subtotal span:last-child {
      font-size: 16px;
      font-weight: 700;
      color: #3A3A3A;
    }

    .cart-actions {
      display: flex;
      flex-direction: row;
      gap: 10px;
      padding: 20px;
    }

    .action-button {
      flex: 1;
      padding: 0;
      border: 1px solid #000000;
      background: #FFFFFF;
      color: #000000;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 50px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: inherit;
      outline: none;
      box-sizing: border-box;
      width: 100%;
    }

    .action-button:hover {
      background: #000000;
      color: #FFFFFF;
    }

    .action-button:active {
      transform: scale(0.98);
    }

    @media (max-width: 768px) {
      .cart-sidebar {
        width: 100%;
        height: 100vh;
        padding-top: 0;
      }
      
      .cart-sidebar-overlay {
        padding-top: 0;
      }
      
      .cart-header {
        padding: 20px 16px;
      }
      
      .cart-items {
        padding: 16px;
      }
      
      .cart-actions {
        padding: 16px;
        gap: 8px;
      }
      
      .action-button {
        font-size: 13px;
        padding: 0;
      }
    }

    @media (max-width: 480px) {
      .cart-item {
        gap: 12px;
        padding: 12px 0;
      }
      
      .item-image {
        width: 50px;
        height: 50px;
      }
      
      .item-details h4 {
        font-size: 14px;
      }
      
      .item-details p {
        font-size: 13px;
      }
      
      .action-button {
        font-size: 12px;
      }
    }
  `

  return (
    <>
      <style>{styles}</style>
      <div className="cart-sidebar-overlay" onClick={onClose}>
        <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h3>Shopping Cart</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="cart-items">
            {cartItemsWithDetails.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
              </div>
            ) : (
              cartItemsWithDetails.map((item) => (
                <div key={item.cartKey} className="cart-item">
                  <div className="item-image">
                    <img src={`${url}/images/${item.image}`} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    {item.selectedColor && (
                      <p className="item-option">Color: <span className="color-swatch" style={{ backgroundColor: item.selectedColor }} title={getColorName(item.selectedColor)}></span></p>
                    )}
                    {item.selectedSize && (
                      <p className="item-option">Size: {item.selectedSize}</p>
                    )}
                    <p>{item.quantity} x Rs. {item.price?.toLocaleString()}</p>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.cartKey)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItemsWithDetails.length > 0 && (
            <>
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>Rs. {totalAmount?.toLocaleString()}</span>
              </div>

              <div className="cart-actions">
                <button 
                  type="button"
                  className="action-button" 
                  onClick={handleCartClick}
                >
                  Cart
                </button>
                <button 
                  type="button"
                  className="action-button" 
                  onClick={handleCheckoutClick}
                >
                  Checkout
                </button>
                <button 
                  type="button"
                  className="action-button"
                  onClick={handleComparisonClick}
                >
                  Comparison
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CartSidebar
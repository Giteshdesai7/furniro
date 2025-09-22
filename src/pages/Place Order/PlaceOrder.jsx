import React, { useState, useContext, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext.jsx'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const { getTotalCartAmount, token, product_list, cartItems, url } = useContext(StoreContext)
  const navigate = useNavigate()

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Sri Lanka",
    street: "",
    city: "",
    province: "Western Province",
    zipCode: "",
    phone: "",
    email: "",
    additionalInfo: ""
  })

  const [paymentMethod, setPaymentMethod] = useState("direct-bank-transfer")

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    let orderItems = []
    Object.keys(cartItems).map(cartKey => {
      if (cartItems[cartKey] > 0) {
        // Extract itemId, color, and size from cartKey (format: itemId_color_size)
        const [itemId, color, size] = cartKey.split('_');
        const product = product_list.find(p => p._id === itemId);
        if (product) {
          let itemInfo = {
            ...product,
            quantity: cartItems[cartKey],
            selectedColor: color !== 'default' ? color : null,
            selectedSize: size !== 'default' ? size : null
          }
          orderItems.push(itemInfo)
        }
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
      paymentMethod: paymentMethod
    }
    
    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } })
      
      if (response.data.success) {
        if (paymentMethod === "cash-on-delivery") {
          // For Cash on Delivery, redirect to success page directly
          navigate(`/verify?success=true&orderId=${response.data.orderId}&paymentMethod=cash-on-delivery`)
        } else {
          // For prepaid orders, redirect to payment page
          const { session_url } = response.data
          window.location.replace(session_url)
        }
      } else {
        alert("Error placing order: " + (response.data.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Order placement error:", error)
      alert("Error placing order. Please try again.")
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])

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
            selectedSize: size !== 'default' ? size : null
          }
        }).filter(item => item && item.quantity > 0)
      }

  const cartItemsWithDetails = getCartItemsWithDetails()

  return (
    <div className='checkout-page'>
      {/* Header Banner */}
      <section className="checkout-hero">
        <div className="hero-overlay">
          <div className="logo-container">
            <img src={assets.logo} alt="Furniro Logo" className="hero-logo" />
          </div>
          <h1>Checkout</h1>
          <div className="breadcrumb" aria-label="Breadcrumb">
            <span>Home</span>
            <span className="chev">&gt;</span>
            <span className="current">Checkout</span>
          </div>
        </div>
      </section>

      {/* Main Checkout Content */}
      <div className="checkout-container">
        <form onSubmit={placeOrder} className="checkout-content">
          {/* Left Column - Billing Details */}
          <div className="billing-details">
            <h2>Billing details</h2>
            <div className="form-row">
              <input
                required
                name='firstName'
                onChange={onChangeHandler}
                value={data.firstName}
                type="text"
                placeholder='First Name'
                className="form-input"
              />
              <input
                required
                name='lastName'
                onChange={onChangeHandler}
                value={data.lastName}
                type="text"
                placeholder='Last Name'
                className="form-input"
              />
            </div>
            <input
              name='companyName'
              onChange={onChangeHandler}
              value={data.companyName}
              type="text"
              placeholder='Company Name (Optional)'
              className="form-input"
            />
            <select
              name='country'
              onChange={onChangeHandler}
              value={data.country}
              className="form-input"
            >
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
            <input
              required
              name='street'
              onChange={onChangeHandler}
              value={data.street}
              type="text"
              placeholder='Street address'
              className="form-input"
            />
            <input
              required
              name='city'
              onChange={onChangeHandler}
              value={data.city}
              type="text"
              placeholder='Town / City'
              className="form-input"
            />
            <select
              name='province'
              onChange={onChangeHandler}
              value={data.province}
              className="form-input"
            >
              <option value="Western Province">Western Province</option>
              <option value="Central Province">Central Province</option>
              <option value="Southern Province">Southern Province</option>
              <option value="Northern Province">Northern Province</option>
            </select>
            <input
              required
              name='zipCode'
              onChange={onChangeHandler}
              value={data.zipCode}
              type="text"
              placeholder='ZIP code'
              className="form-input"
            />
            <input
              required
              name='phone'
              onChange={onChangeHandler}
              value={data.phone}
              type="text"
              placeholder='Phone'
              className="form-input"
            />
            <input
              required
              name='email'
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder='Email address'
              className="form-input"
            />
            <textarea
              name='additionalInfo'
              onChange={onChangeHandler}
              value={data.additionalInfo}
              placeholder='Additional information'
              className="form-textarea"
              rows="4"
            />
          </div>

          {/* Right Column - Product & Payment */}
          <div className="order-summary">
            <div className="order-summary-header">
              <h2>Product</h2>
              <h2 className='subtotal-header'>Subtotal</h2>
            </div>
            
            <div className="order-items">
              {cartItemsWithDetails.map((item) => (
                <div key={item._id} className="order-item-row">
                  <div className="product-name">
                    <span>{item.name} x {item.quantity}</span>
                    {(item.selectedColor || item.selectedSize) && (
                      <span className="selection-details">
                        {item.selectedColor && (
                          <span
                            className="color-swatch"
                            style={{ backgroundColor: item.selectedColor }}
                            title="Selected color"
                          />
                        )}
                        {item.selectedSize && (
                          <span className="size-chip" title="Selected size">{item.selectedSize}</span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="product-price">
                    <span>Rs. {(item.quantity * item.price)?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rs. {getTotalCartAmount()?.toLocaleString()}</span>
              </div>
              <div className="total-row final-total">
                <span>Total</span>
                <span>Rs. {getTotalCartAmount()?.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="payment-options">
              <div className="payment-option">
                <div className="payment-option-header">
                  <input
                    type="radio"
                    id="direct-bank-transfer"
                    name="paymentMethod"
                    value="direct-bank-transfer"
                    checked={paymentMethod === "direct-bank-transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="direct-bank-transfer">Direct Bank Transfer</label>
                </div>
                <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.</p>
              </div>
              <div className="payment-option">
                <div className="payment-option-header">
                  <input
                    type="radio"
                    id="direct-bank-transfer-2"
                    name="paymentMethod"
                    value="direct-bank-transfer-2"
                    checked={paymentMethod === "direct-bank-transfer-2"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="direct-bank-transfer-2">Direct Bank Transfer</label>
                </div>
              </div>
              <div className="payment-option">
                <div className="payment-option-header">
                  <input
                    type="radio"
                    id="cash-on-delivery"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    checked={paymentMethod === "cash-on-delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="cash-on-delivery">Cash On Delivery</label>
                </div>
              </div>
            </div>

            <div className="privacy-policy">
              <p>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <a href="#">privacy policy</a>.</p>
            </div>

            <button type='submit' className="place-order-btn">Place order</button>
          </div>
        </form>
      </div>

      {/* Features Section */}
      <div className="checkout-features">
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

export default PlaceOrder
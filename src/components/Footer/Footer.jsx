import React, { useState } from 'react'
import './Footer.css'
import axios from 'axios'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      console.log('Please enter your email address')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log('Please enter a valid email address')
      return
    }

    setIsSubscribing(true)
    
    try {
      const response = await axios.post('http://localhost:4000/api/newsletter/subscribe', {
        email: email.trim()
      })
      
      if (response.data.success) {
        console.log('Successfully subscribed to newsletter!')
        setEmail('')
      } else {
        console.log(response.data.message || 'Failed to subscribe')
      }
    } catch (error) {
      if (error.response?.data?.message) {
        console.log(error.response.data.message)
      } else {
        console.log('Failed to subscribe. Please try again.')
      }
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className='footer' id="footer">
      <div className="footer-content">
        <div className="footer-col footer-brand">
          <h3 className="brand-name">Funiro.</h3>
          <p className="brand-address">400 University Drive Suite 200 Coral<br/>Gables,<br/>FL 33134 USA</p>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">Links</h4>
          <ul>
            <li>Home</li>
            <li>Shop</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">Help</h4>
          <ul>
            <li>Payment Options</li>
            <li>Returns</li>
            <li>Privacy Policies</li>
          </ul>
        </div>
        <div className="footer-col footer-newsletter">
          <h4 className="footer-title">Newsletter</h4>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="newsletter-row">
              <input 
                type="email" 
                placeholder="Enter Your Email Address" 
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubscribing}
                required
              />
              <button 
                type="submit" 
                className="subscribe-btn"
                disabled={isSubscribing}
              >
                {isSubscribing ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">2023 funiro. All rights reserved</p>
    </div>
  )
}

export default Footer
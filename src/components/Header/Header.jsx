import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'
const Header = () => {
   const navigate = useNavigate();
  return (
    <div className="header" >
        <div className="header-content">
            <div className="header-text">
                <p className="header-subtitle">New Arrival</p>
                <h1 className="header-title">Discover Our<br />New Collection</h1>
                <p className="header-description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
                </p>
                <button className="header-btn" onClick={() => {const menuSection = document.getElementById("explore-menu");
  if (menuSection) {
    menuSection.scrollIntoView({ behavior: "smooth" });
  }
}}>BUY NOW</button>
            </div>
        </div>
    </div>
  )
}

export default Header
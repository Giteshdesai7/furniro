import React, { useContext, useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import App from '../../App';
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext.jsx';
import CartSidebar from '../CartSidebar/CartSidebar.jsx';


const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { getTotalCartAmount, token, setToken, url, product_list, userData, setUserData, fetchUserData } = useContext(StoreContext);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserData(null);
    setIsProfileDropdownOpen(false);
    navigate("/");
    console.log("Logged out successfully!");
  };

  const handleMyOrders = () => {
    navigate("/myorders");
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const filteredProducts = product_list.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className='navbar'>
      <Link to="/" className="navbar-logo">
        <img src={assets.logo} alt="Furniro Logo" className="logo-icon" />
        <span className="logo-text">Furniro</span>
      </Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <Link to='/shop' onClick={() => setMenu("shop")} className={menu === "shop" ? "active" : ""}>Shop</Link>
        <a href='#app-download' onClick={() => setMenu("about")} className={menu === "about" ? "active" : ""}>About</a>
        <Link to='/contact' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>Contact</Link>
        <Link to='/blog' onClick={() => setMenu("blog")} className={menu === "blog" ? "active" : ""}>Blog</Link>
      </ul>
      <div className="navbar-right">
        <div 
          ref={dropdownRef}
          className="navbar-icon profile-icon-container" 
      onClick={() => {
        if (token) {
          setIsProfileDropdownOpen(!isProfileDropdownOpen);
          // Always fetch user data when dropdown opens to ensure it's fresh
          fetchUserData(token);
        } else {
          setShowLogin(true);
        }
      }}
        >
          <img src={assets.profile_icon} alt="Profile" />
          {token && isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <p className="user-name">{userData?.name || "Loading..."}</p>
                <p className="user-email">{userData?.email || ""}</p>
              </div>
              <div className="profile-dropdown-divider"></div>
              <button className="profile-dropdown-item" onClick={handleMyOrders}>
                My Orders
              </button>
              <button className="profile-dropdown-item logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="navbar-icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <img src={assets.search_icon} alt="Search" />
        </div>
        <div className="navbar-icon" onClick={() => navigate('/like')}>
          <img src={assets.heart_icon} alt="Wishlist" />
        </div>
        <div className="navbar-icon navbar-cart">
          <button onClick={() => setIsCartOpen(true)}>
            <img src={assets.cart_icon} alt="Cart" />
            <div className={getTotalCartAmount() === 0 ? "" : "cart-dot"}></div>
          </button>
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Search Box */}
      {isSearchOpen && (
        <div className="search-overlay" onClick={() => setIsSearchOpen(false)}>
          <div className="search-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              <button type="submit" className="search-submit-btn">
                <img src={assets.search_icon} alt="Search" />
              </button>
            </form>
            
            {/* Search Results Dropdown */}
            {searchQuery && filteredProducts.length > 0 && (
              <div className="search-results">
                {filteredProducts.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="search-result-item"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <img src={`${url}/images/${product.image}`} alt={product.name} />
                    <div className="search-result-info">
                      <h4>{product.name}</h4>
                      <p>Rs. {product.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {filteredProducts.length > 5 && (
                  <div className="search-more" onClick={() => {
                    navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}>
                    View all {filteredProducts.length} results
                  </div>
                )}
        </div>
            )}
            
            {searchQuery && filteredProducts.length === 0 && (
              <div className="search-no-results">
                No products found for "{searchQuery}"
              </div>
            )}
      </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
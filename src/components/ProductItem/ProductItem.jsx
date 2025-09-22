import React, {useContext, useState, useRef, useEffect} from 'react'
import './ProductItem.css' 
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const ProductItem = ({id, name, price, description, image, stock, discount, isNew, viewMode = 'grid' }) => {
    const {cartItems, addToCart, removeFromCart, url, likedItems, toggleLike} = useContext(StoreContext);
    const navigate = useNavigate();
    const [showShareDropdown, setShowShareDropdown] = useState(false);
    const shareDropdownRef = useRef(null);

    // Determine if the item is out of stock
    const isOutOfStock = stock <= 0;
    
    // Determine if adding one more would exceed available stock
    const currentQuantity = cartItems[id] || 0;
    const reachedMaxStock = currentQuantity >= stock;

    const handleProductClick = () => {
        navigate(`/product/${id}`);
    };

    const handleLikeClick = (e) => {
        e.stopPropagation();
        toggleLike(id);
    };

    const handleCompareClick = (e) => {
        e.stopPropagation();
        navigate(`/compare?product=${id}`);
    };

    const handleShareClick = (e) => {
        e.stopPropagation();
        setShowShareDropdown(!showShareDropdown);
    };

    const handleCopyLink = async (e) => {
        e.stopPropagation();
        const productUrl = `${window.location.origin}/product/${id}`;
        try {
            await navigator.clipboard.writeText(productUrl);
            alert('Product link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy link');
        }
        setShowShareDropdown(false);
    };

    const handleSocialShare = (platform, e) => {
        e.stopPropagation();
        const productUrl = `${window.location.origin}/product/${id}`;
        const shareText = `Check out this amazing product: ${name}`;
        
        let shareUrl = '';
        
        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + productUrl)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
                break;
            case 'instagram':
                // Instagram doesn't support direct URL sharing, so we'll copy the link
                handleCopyLink(e);
                return;
            default:
                return;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
        setShowShareDropdown(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target)) {
                setShowShareDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`product-item ${viewMode === 'list' ? 'list-view' : 'grid-view'}`} onClick={handleProductClick}>
            <div className="product-item-image-container">
                <img className='product-item-image' src={url+"/images/"+image} alt={name} />
                
                {/* Discount Badge */}
                {discount && (
                    <div className="product-badge discount-badge">
                        -{discount}%
                    </div>
                )}
                
                {/* New Badge */}
                {isNew && (
                    <div className="product-badge new-badge">
                        New
                    </div>
                )}
                
                {/* Overlay with actions */}
                <div className="product-overlay" onClick={(e) => e.stopPropagation()}>
                    <button className="add-to-cart-btn" onClick={() => addToCart(id)}>
                        Add to cart
                    </button>
                    <div className="product-actions">
                        <div className="share-container" ref={shareDropdownRef}>
                            <button className="action-btn" onClick={handleShareClick}>
                                <span>Share</span>
                            </button>
                            {showShareDropdown && (
                                <div className="share-dropdown">
                                    <button 
                                        className="share-option" 
                                        onClick={(e) => handleSocialShare('whatsapp', e)}
                                    >
                                        <div className="share-icon">💬</div>
                                        <span>WhatsApp</span>
                                    </button>
                                    <button 
                                        className="share-option" 
                                        onClick={(e) => handleSocialShare('facebook', e)}
                                    >
                                        <div className="share-icon">📘</div>
                                        <span>Facebook</span>
                                    </button>
                                    <button 
                                        className="share-option" 
                                        onClick={(e) => handleSocialShare('instagram', e)}
                                    >
                                        <div className="share-icon">📷</div>
                                        <span>Instagram</span>
                                    </button>
                                    <button 
                                        className="share-option" 
                                        onClick={handleCopyLink}
                                    >
                                        <div className="share-icon">🔗</div>
                                        <span>Copy Link</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <button className="action-btn" onClick={handleCompareClick}>
                            <span>Compare</span>
                        </button>
                        <button className={`action-btn like-btn ${likedItems[id] ? 'liked' : ''}`} onClick={handleLikeClick}>
                            <img src={assets.heart_icon} alt="Like" className="heart-icon" />
                            <span>{likedItems[id] ? 'Liked' : 'Like'}</span>
                        </button>
                    </div>
                </div>
            </div> 
            
            <div className="product-item-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-description">{description}</p>
                <div className="product-pricing">
                    <span className="current-price">Rp {price?.toLocaleString()}</span>
                    {discount && (
                        <span className="original-price">
                            Rp {Math.round(price / (1 - discount/100))?.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </div>      
    )
}

export default ProductItem
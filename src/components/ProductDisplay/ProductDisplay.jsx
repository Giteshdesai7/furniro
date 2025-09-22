import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProductDisplay.css'  
import { StoreContext } from '../../context/StoreContext'
import ProductItem from '../ProductItem/ProductItem'
const ProductDisplay = ({category}) => {

    const {product_list} = useContext(StoreContext)
    const [showMore, setShowMore] = useState(false)
    const navigate = useNavigate()

    // Filter products based on category
    const filteredProducts = product_list.filter((item) => {
        return category === "All" || category === item.category;
    });

    // Show only 8 products initially, or all if showMore is true
    const displayedProducts = showMore ? filteredProducts : filteredProducts.slice(0, 8);
    const hasMoreProducts = filteredProducts.length > 8;

  return (
    <div className='product-display' id='product-display'>
        <div className="product-display-header">
            <h2>Our Products</h2>
        </div>
        <div className="product-display-grid">
            { displayedProducts.map((item,index) => {
                return <ProductItem  key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} stock={item.stock || 0} />
            })}
        </div>
        
        {hasMoreProducts && !showMore && (
            <div className="show-more-container">
                <button className="show-more-btn" onClick={() => navigate('/shop')}>
                    Show More
                </button>
            </div>
        )}
        
        {showMore && hasMoreProducts && (
            <div className="show-more-container">
                <button className="show-more-btn" onClick={() => setShowMore(false)}>
                    Show Less
                </button>
            </div>
        )}
    </div>
  )
}

export default ProductDisplay
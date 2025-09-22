import React, { useContext, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './ProductComparison.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const ProductComparison = () => {
  const { product_list, url, addToCart } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const productIdFromUrl = searchParams.get('product');
  
  const [selectedProducts, setSelectedProducts] = useState([
    null,
    null,
    null // Three slots for products
  ]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Set the product from URL parameter when component loads
  useEffect(() => {
    if (productIdFromUrl && product_list.length > 0) {
      const productFromUrl = product_list.find(product => product._id === productIdFromUrl);
      if (productFromUrl) {
        setSelectedProducts([productFromUrl, null, null]);
      }
    }
  }, [productIdFromUrl, product_list]);

  const handleAddProduct = (index) => {
    setSelectedSlot(index);
    setShowProductModal(true);
  };

  const handleSelectProduct = (product) => {
    if (selectedSlot !== null) {
      const newSelectedProducts = [...selectedProducts];
      newSelectedProducts[selectedSlot] = product;
      setSelectedProducts(newSelectedProducts);
    }
    setShowProductModal(false);
    setSelectedSlot(null);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setSelectedSlot(null);
  };

  const handleRemoveProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index] = null;
    setSelectedProducts(newSelectedProducts);
  };

  const handleAddToCart = (productId) => {
    addToCart(productId);
  };

  // Generate dynamic comparison data from selected products
  const generateComparisonData = () => {
    const generalAttributes = [
      { name: "Sales Package", key: "salesPackage" },
      { name: "Model Number", key: "modelNumber" },
      { name: "Secondary Material", key: "secondaryMaterial" },
      { name: "Configuration", key: "configuration" },
      { name: "Upholstery Material", key: "upholsteryMaterial" },
      { name: "Upholstery Color", key: "upholsteryColor" }
    ];

    const productAttributes = [
      { name: "Filling Material", key: "fillingMaterial" },
      { name: "Finish Type", key: "finishType" },
      { name: "Adjustable Headrest", key: "adjustableHeadrest" },
      { name: "Maximum Load Capacity", key: "maximumLoadCapacity" },
      { name: "Origin of Manufacture", key: "originOfManufacture" }
    ];

    const dimensionAttributes = [
      { name: "Width", key: "width", suffix: " cm" },
      { name: "Height", key: "height", suffix: " cm" },
      { name: "Depth", key: "depth", suffix: " cm" },
      { name: "Weight", key: "weight", suffix: " kg" },
      { name: "Seat Height", key: "seatHeight", suffix: " cm" },
      { name: "Leg Height", key: "legHeight", suffix: " cm" }
    ];

    const warrantyAttributes = [
      { name: "Warranty Summary", key: "warrantySummary" },
      { name: "Warranty Service Type", key: "warrantyServiceType" },
      { name: "Covered in Warranty", key: "coveredInWarranty" },
      { name: "Not Covered in Warranty", key: "notCoveredInWarranty" },
      { name: "Domestic Warranty", key: "domesticWarranty" }
    ];

    const getAttributeValues = (attributes) => {
      return attributes.map(attr => ({
        name: attr.name,
        values: selectedProducts.map(product => {
          if (!product) return "-";
          const value = product[attr.key];
          if (!value) return "-";
          return attr.suffix ? `${value}${attr.suffix}` : value;
        })
      }));
    };

    return [
      {
        category: "General",
        attributes: getAttributeValues(generalAttributes)
      },
      {
        category: "Product",
        attributes: getAttributeValues(productAttributes)
      },
      {
        category: "Dimensions",
        attributes: getAttributeValues(dimensionAttributes)
      },
      {
        category: "Warranty",
        attributes: getAttributeValues(warrantyAttributes)
      }
    ];
  };

  const comparisonData = generateComparisonData();

  return (
    <div className="product-comparison-page">
      {/* Header Banner */}
      <section className="comparison-hero">
        <div className="hero-overlay">
          <h1>Product Comparison</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="chev">›</span>
            <span className="current">Comparison</span>
          </div>
        </div>
      </section>

      {/* Product Comparison Section */}
      <div className="comparison-container">
        <div className="comparison-grid">
          {/* Left Column - Go to Product page */}
          <div className="comparison-column left-column">
            <h3>Go to Product page for more Products</h3>
            <Link to="/shop" className="view-more-link">View More</Link>
          </div>

          {/* Product 1 */}
          <div className="comparison-column product-column">
            {selectedProducts[0] ? (
              <>
                <button 
                  className="remove-product-btn"
                  onClick={() => handleRemoveProduct(0)}
                  title="Remove from comparison"
                >
                  ×
                </button>
                <div className="product-image">
                  <img src={`${url}/images/${selectedProducts[0].image}`} alt={selectedProducts[0].name} />
                </div>
                <h3 className="product-name">{selectedProducts[0].name}</h3>
                <p className="product-price">Rs. {selectedProducts[0].price?.toLocaleString()}</p>
                <div className="product-rating">
                  <div className="stars">★★★★★</div>
                  <span className="rating-text">4.7 (204 Review)</span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(selectedProducts[0]._id)}
                >
                  Add To Cart
                </button>
              </>
            ) : (
              <div className="empty-product">
                <h3>Add A Product</h3>
                <button className="choose-product-btn" onClick={() => handleAddProduct(0)}>
                  Choose a Product
                  <span className="arrow">▼</span>
                </button>
              </div>
            )}
          </div>

          {/* Product 2 */}
          <div className="comparison-column product-column">
            {selectedProducts[1] ? (
              <>
                <button 
                  className="remove-product-btn"
                  onClick={() => handleRemoveProduct(1)}
                  title="Remove from comparison"
                >
                  ×
                </button>
                <div className="product-image">
                  <img src={`${url}/images/${selectedProducts[1].image}`} alt={selectedProducts[1].name} />
                </div>
                <h3 className="product-name">{selectedProducts[1].name}</h3>
                <p className="product-price">Rs. {selectedProducts[1].price?.toLocaleString()}</p>
                <div className="product-rating">
                  <div className="stars">★★★★★</div>
                  <span className="rating-text">4.2 (145 Review)</span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(selectedProducts[1]._id)}
                >
                  Add To Cart
                </button>
              </>
            ) : (
              <div className="empty-product">
                <h3>Add A Product</h3>
                <button className="choose-product-btn" onClick={() => handleAddProduct(1)}>
                  Choose a Product
                  <span className="arrow">▼</span>
                </button>
              </div>
            )}
          </div>

          {/* Product 3 */}
          <div className="comparison-column product-column">
            {selectedProducts[2] ? (
              <>
                <button 
                  className="remove-product-btn"
                  onClick={() => handleRemoveProduct(2)}
                  title="Remove from comparison"
                >
                  ×
                </button>
                <div className="product-image">
                  <img src={`${url}/images/${selectedProducts[2].image}`} alt={selectedProducts[2].name} />
                </div>
                <h3 className="product-name">{selectedProducts[2].name}</h3>
                <p className="product-price">Rs. {selectedProducts[2].price?.toLocaleString()}</p>
                <div className="product-rating">
                  <div className="stars">★★★★★</div>
                  <span className="rating-text">4.5 (89 Review)</span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(selectedProducts[2]._id)}
                >
                  Add To Cart
                </button>
              </>
            ) : (
              <div className="empty-product">
                <h3>Add A Product</h3>
                <button className="choose-product-btn" onClick={() => handleAddProduct(2)}>
                  Choose a Product
                  <span className="arrow">▼</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="comparison-table">
          {comparisonData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="comparison-section">
              <h4 className="section-title">{section.category}</h4>
              {section.attributes.map((attribute, attrIndex) => (
                <div key={attrIndex} className="comparison-row">
                  <div className="attribute-name">{attribute.name}</div>
                  <div className="attribute-values">
                    {attribute.values.map((value, valueIndex) => (
                      <div key={valueIndex} className="attribute-value">
                        {value || "-"}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>

      {/* Features Section */}
      <div className="comparison-features">
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

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="product-modal-overlay" onClick={handleCloseModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Choose a Product</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="product-grid">
              {product_list.map((product) => (
                <div 
                  key={product._id} 
                  className="product-option"
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="product-option-image">
                    <img src={`${url}/images/${product.image}`} alt={product.name} />
                  </div>
                  <h4>{product.name}</h4>
                  <p>Rs. {product.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductComparison;

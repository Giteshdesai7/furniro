import React from 'react'
import './ExploreMenu.css'
import { range_list } from '../../assets/assets'

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="browse-range" id='explore-menu'>
      <div className="browse-range-header">
        <h2>Browse The Range</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      
      <div className="range-categories">
        {range_list.map((item, index) => {
          return (
            <div 
              key={index} 
              className="range-category"
              onClick={() => setCategory(prev => prev === item.category_name ? "All" : item.category_name)}
            >
              <div className="category-image">
                <img src={item.category_image} alt={item.category_name} />
              </div>
              <h3 className="category-name">{item.category_name}</h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExploreMenu
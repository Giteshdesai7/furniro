import React, { useState } from 'react'
import './ExploreMore.css'
import { assets } from '../../assets/assets.js'

const ExploreMore = () => {
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            id: 1,
            image: assets.rectangle_24,
            number: "01",
            category: "Bed Room",
            title: "Inner Peace"
        },
        {
            id: 2,
            image: assets.rectangle_25,
            number: "02",
            category: "Living Room",
            title: "Comfort Zone"
        },
        {
            id: 3,
            image: assets.rectangle_24,
            number: "03",
            category: "Kitchen",
            title: "Modern Space"
        },
        {
            id: 4,
            image: assets.rectangle_25,
            number: "04",
            category: "Dining Room",
            title: "Elegant Style"
        }
    ]

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    return (
        <div className="explore-more">
            <div className="explore-more-content">
                <div className="explore-more-left">
                    <h2>50+ Beautiful rooms inspiration</h2>
                    <p>Our designer already made a lot of beautiful prototype of rooms that inspire you</p>
                    <button className="explore-btn">Explore More</button>
                </div>
                
                <div className="explore-more-right">
                <button className="slide-arrow-1" onClick={nextSlide}>
                                                <img src={assets.right_arrow} alt="Next" onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }} />
                                            </button>
                    <div className="slides-wrapper">
                        <div className="slides-container" style={{ transform: `translateX(-${currentSlide * 428}px)` }}>
                            {slides.map((slide, index) => (
                                <div key={slide.id} className={`slide ${index === 0 ? 'active-slide' : 'preview-slide'}`}>
                                    <img src={slide.image} alt={slide.title} />
                                    {index === 0 && (
                                        <div className="slide-content">
                                            <div className="slide-info">
                                                <span className="slide-number">{slides[currentSlide].number}</span>
                                                <span className="slide-divider">——</span>
                                                <span className="slide-category">{slides[currentSlide].category}</span>
                                            </div>
                                            <h3 className="slide-title">{slides[currentSlide].title}</h3>
                                            <button className="slide-arrow" onClick={nextSlide}>
                                                →
                                            </button>
                                           
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Navigation arrow */}
                        <button className="nav-arrow-right" onClick={nextSlide}>
                            <img src={assets.right_arrow} alt="Next" onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }} />
                            <span style={{display: 'none', fontSize: '20px', color: '#B88E2F'}}>→</span>
                        </button>
                    </div>
                    
                    {/* Slide indicators */}
                    <div className="slide-indicators">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExploreMore

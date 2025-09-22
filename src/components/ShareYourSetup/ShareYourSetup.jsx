import React from 'react'
import './ShareYourSetup.css'
import { assets } from '../../assets/assets'

const ShareYourSetup = () => {
    return (
        <div className="share-your-setup">
            <div className="setup-header">
                <p>Share your setup with</p>
                <h2>#FurniroFurniture</h2>
            </div>

            <div className="setup-gallery">
                <div className="gallery-item item-1">
                    <img src={assets.rectangle_36} alt="setup1" />
                </div>
                <div className="gallery-item item-2">
                    <img src={assets.rectangle_38} alt="setup2" />
                </div>
                <div className="gallery-item item-3">
                    <img src={assets.rectangle_40} alt="setup3" />
                </div>
                <div className="gallery-item item-4">
                    <img src={assets.rectangle_43} alt="setup4" />
                </div>
                <div className="gallery-item item-5">
                    <img src={assets.rectangle_45} alt="setup5" />
                </div>
                <div className="gallery-item item-6">
                    <img src={assets.rectangle_37} alt="setup6" />
                </div>
                <div className="gallery-item item-7">
                    <img src={assets.rectangle_39} alt="setup7" />
                </div>
                <div className="gallery-item item-8">
                    <img src={assets.rectangle_41} alt="setup8" />
                </div>
                <div className="gallery-item item-9">
                    <img src={assets.rectangle_44} alt="setup9" />
                </div>
            </div>
        </div>
    )
}

export default ShareYourSetup
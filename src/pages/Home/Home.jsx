import React from 'react'
import './Home.css' 
import Header from "../../components/Header/Header"
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import { useState } from 'react'
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay'
import ExploreMore from '../../components/ExploreMore/ExploreMore'
import ShareYourSetup from '../../components/ShareYourSetup/ShareYourSetup'
import App from '../../App'

const Home = () => {

    const[category, setCategory] = useState('All');
  return (
    <div>
        <Header />
        <ExploreMenu category={category} setCategory={setCategory}/>
        <ProductDisplay category={category}/>
        <ExploreMore />
        <ShareYourSetup />
    </div>
  )
}

export default Home
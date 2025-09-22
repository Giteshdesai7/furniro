import React from 'react'
import Navbar from './components/Navbar/Navbar'
import {Routes, Route} from 'react-router-dom' 
import Home from './pages/Home/Home.jsx'
import Shop from './pages/Shop/Shop.jsx'
import ProductDescription from './pages/ProductDescription/ProductDescription.jsx'
import ProductComparison from './pages/ProductComparison/ProductComparison.jsx'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/Place Order/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopUp/LoginPopup'
import { useState } from 'react'
import Verify from './pages/Verify/Verify.jsx'
import MyOrders from './pages/MyOrders/MyOrders.jsx'
import Contact from './pages/Contact/Contact.jsx'
import Like from './pages/Like/Like.jsx'
import Blog from './pages/Blog/Blog.jsx'
import BlogPost from './pages/BlogPost/BlogPost.jsx'

const App = () => { 

  const[showLogin, setShowLogin] = useState(false)

  
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
      <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/shop' element={<Shop/>}/>
        <Route path='/product/:id' element={<ProductDescription/>}/>
        <Route path='/compare' element={<ProductComparison/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>
        <Route path='/verify' element={<Verify/>}/>
        <Route path='/myorders' element={<MyOrders/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/like' element={<Like/>} />
        <Route path='/blog' element={<Blog/>} />
        <Route path='/blog/:id' element={<BlogPost/>} />
        
      </Routes>
    </div>
    <Footer/>
    </>
  
  )
}

export default App

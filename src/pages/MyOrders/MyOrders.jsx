import React from 'react';
import "./MyOrders.css";
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import {assets} from '../../assets/assets.js';

const MyOrders = () => {


 
 const {url, token} = useContext(StoreContext);
  const [data, setData] = useState([]);
  
  const fetchOrders = async () => {
   try {
    const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
    setData(response.data.data.reverse());
   } catch (error) {
    console.error("Error fetching orders:", error);
   }
  };

  useEffect(() => {
    if(token) {
      fetchOrders();
    }

  }, [token]);


  return (
    <div className='my-orders'>
      
      <div className='container'>
      <h2>My Orders</h2>
        {data.map((order, index) => {
          return (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="" />
              <p>{order.items.map((item, index)=>{
                return (
                  <span key={index} className="order-item-details">
                    {item.name} x {item.quantity}
                    {item.selectedColor && (
                      <span className="color-indicator">
                        <span className="color-swatch" style={{backgroundColor: item.selectedColor}}></span>
                        <span className="color-label">Color</span>
                      </span>
                    )}
                    {item.selectedSize && ` (Size: ${item.selectedSize})`}
                    {index !== order.items.length - 1 ? ", " : ""}
                  </span>
                )
              })}</p>
              <p>Order Id: {order._id}</p>
              <p>₹{order.amount}</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.status}</b></p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          )
        })}
      </div>
      </div>
  )
  };

export default MyOrders;
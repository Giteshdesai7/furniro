import "./Verify.css";
import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import {useSearchParams} from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext.jsx'
import { useNavigate } from 'react-router-dom';



const Verify = () => {

    const[searchParams, setSearchParams] = useSearchParams();
    const success=searchParams.get("success")
    const orderId=searchParams.get("orderId")
    const paymentMethod=searchParams.get("paymentMethod")
    const {url}= useContext(StoreContext);
    const navigate = useNavigate();
    
    const verifyPayment = async()=>{
        if (paymentMethod === "cash-on-delivery") {
            // For Cash on Delivery orders, no payment verification needed
            // Just redirect to orders page after a short delay
            setTimeout(() => {
                navigate("/myorders");
            }, 2000);
        } else {
            // For prepaid orders, verify payment with backend
            const response =await axios.post(url+"/api/order/verify",{success, orderId});
            if (response.data.success) {
                navigate("/myorders");
            }
            else{
                navigate("/");
            }
        }
    }
    
    useEffect(()=>{
        verifyPayment();
    },[])
  return (
    <div className="verify">
        <div className="spinner">

        </div>

    </div>
  )
}

export default Verify
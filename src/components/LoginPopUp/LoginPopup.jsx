import React, { useContext } from 'react'
import './LoginPopup.css'
import {useState} from 'react'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'


const LoginPopup = ({setShowLogin}) => {

  const {url, setToken, fetchUserData} = useContext(StoreContext)

  const[currState, setCurrState] = useState("Login")
  const[data, setData] = useState({
    name:"",
    email:"",
    password:""
  })

  const onChangeHandler = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }


  const onLogin = async (event)=> {
    event.preventDefault()
    let newUrl = url;
    if(currState==="Login"){
      newUrl += "/api/user/login" 
    }
    else{
      newUrl += "/api/user/register"
    }
try{
    const response= await axios.post(newUrl,data);

    if(response.data.success){
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      await fetchUserData(response.data.token);
      console.log(currState==="Login"? "Logged In Successfully":"Account Created Successfully");
      setTimeout(() => {
        setShowLogin(false); 
      }, 1500); 
    }
    else{
      console.log(response.data.message || "Something went wrong");
    }
  }catch(error){
    console.error(err);
    console.log("Server error. Please try again later.");
    
  }
};
  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=""/>
         
        </div>
        <div className="login-popup-inputs">
          {currState==="Login"?<></>:<input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your Name" required/>}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your E-Mail" required/>
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required/>
        </div>
        <button type='submit'>{currState==="Sign Up"? "Create account": "Login" }</button>
          <div className="login-popup-condition">
            <input id="cb1" type="checkbox" required/>
            <p>By continuing, I agree to the Terms of Use & Privacy Policy</p>
           
          </div>
          {currState==="Login"? <p>Create a New Account? <span onClick={()=> setCurrState("Sign Up")}>Click Here</span></p>
          :<p>Already Have an Account? <span onClick={()=> setCurrState("Login")}>Login Here</span></p>
              }
          
      </form>
    </div>
  )
}

export default LoginPopup;
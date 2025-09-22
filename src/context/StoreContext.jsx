import { createContext } from "react";  
import axios from 'axios';
import { useEffect } from "react";
import { useState } from "react";
export const StoreContext = createContext(null);
   const  StoreContextProvider = (props) => {

    // Hydrate cart from localStorage so it persists across refreshes (for guests and signed-in users)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const raw = localStorage.getItem("cartItems");
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    });
    const[likedItems, setLikedItems] = useState({});

    const url = (import.meta?.env?.VITE_API_URL) || "http://localhost:4000";
    const [token,setToken] = useState("");
    const [product_list, setProductList] = useState([])
    const [userData, setUserData] = useState(null)
    const addToCart = async (itemId, selectedColor = null, selectedSize = null) => {
        // Find the product item in the product_list
        const productItem = product_list.find(item => item._id === itemId);
        
        // Check if product exists and has stock
        if (!productItem) {
            console.log("Product not found!");
            return;
        }
        
        if (productItem.stock <= 0) {
            console.log("Item out of stock!");
            return;
        }
        
        // Create a unique cart key that includes color and size
        const cartKey = `${itemId}_${selectedColor || 'default'}_${selectedSize || 'default'}`;
        
        // Check if adding one more would exceed available stock
        const currentQuantity = cartItems[cartKey] || 0;
        if (currentQuantity + 1 > productItem.stock) {
            console.log(`Only ${productItem.stock} items available!`);
            return;
        }
        
        if(!cartItems[cartKey]){
            setCartItems((prev)=> ({...prev, [cartKey]: 1}))
            console.log("Added to cart");
        }
        else{
            setCartItems((prev)=> ({...prev, [cartKey]: prev[cartKey] + 1 }))
            console.log("Added to cart");
        }
        
        if(token){
            try {
                await axios.post(url+"/api/cart/add",{
                    itemId, 
                    selectedColor, 
                    selectedSize
                },{headers:{token}})
            } catch (error) {
                console.log("Error adding to cart:", error);
            }
        }
    }

    const removeFromCart = async(cartKey) => {
        setCartItems((prev)=> {
            const nextQty = (prev[cartKey] || 0) - 1;
            if (nextQty <= 0) {
                const copy = { ...prev };
                delete copy[cartKey];
                return copy;
            }
            return ({...prev, [cartKey]: nextQty});
        });
        console.log('Removed from cart');
        
        if(token){
            try {
                await axios.post(url+"/api/cart/remove", {cartKey},{headers:{token}})
            } catch (error) {
                console.log("Error removing from cart:", error);
            }
        }
    }

    const toggleLike = async(itemId) => {
        const isLiked = likedItems[itemId];
        
        if(isLiked) {
            // Remove from likes
            setLikedItems((prev) => {
                const newLikes = {...prev};
                delete newLikes[itemId];
                return newLikes;
            });
            console.log('Removed from likes');
        } else {
            // Add to likes
            setLikedItems((prev) => ({...prev, [itemId]: true}));
            console.log('Added to likes');
        }
        
        if(token){
            try {
                await axios.post(url+"/api/likes/toggle", {itemId},{headers:{token}})
            } catch (error) {
                console.log("Error toggling like:", error);
            }
        }
    }

    const loadLikedData = async(token) =>{
        try {
            const response = await axios.post(url+"/api/likes/get", {},{headers:{token}});
            setLikedItems(response.data.likedData || {});
        } catch (error) {
            console.log("Error loading liked data:", error);
            setLikedItems({});
        }
    }
   const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const cartKey in cartItems)
        {
            if(cartItems[cartKey]>0){
                // Extract itemId from cartKey (format: itemId_color_size)
                const itemId = cartKey.split('_')[0];
                let itemInfo = product_list.find((product)=>product._id === itemId)
                if(itemInfo && itemInfo.price) {
                    totalAmount += itemInfo.price*cartItems[cartKey];
                }
            }
        }
        return totalAmount;
   }

   const fetchProductList = async ()=> {
    try {
        const response = await axios.get(url+"/api/product/list");
        setProductList(response.data.data)
        
        // Do not mutate cart here; rendering will ignore products that no longer exist.
    } catch (error) {
        console.log("Error fetching product list:", error);
        setProductList([]);
    }
   }

   const loadCartData = async(token) =>{
    try {
        const response = await axios.post(url+"/api/cart/get", {},{headers:{token}});
        // Merge server cart with any locally stored cart (sum quantities by key)
        const serverCart = response.data.cartData || {};
        let localCart = {};
        try {
            const raw = localStorage.getItem("cartItems");
            localCart = raw ? JSON.parse(raw) : {};
        } catch (e) {
            localCart = {};
        }
        const merged = { ...localCart };
        Object.keys(serverCart).forEach((key)=>{
            const serverQty = serverCart[key] || 0;
            const localQty = merged[key] || 0;
            merged[key] = serverQty + localQty;
        });
        setCartItems(merged);
    } catch (error) {
        console.log("Error loading cart data:", error);
        setCartItems({});
    }
   }

   const fetchUserData = async(token) => {
    try {
        console.log("Fetching user data with token:", token);
        const response = await axios.get(url+"/api/user/getUserData", {headers:{token}});
        console.log("User data response:", response.data);
        if(response.data.success) {
            setUserData(response.data.data);
            console.log("User data set successfully:", response.data.data);
        } else {
            console.log("API returned success: false", response.data);
            setUserData(null);
        }
    } catch (error) {
        console.log("Error fetching user data:", error);
        console.log("Error response:", error.response?.data);
        setUserData(null);
    }
   }

   useEffect(()=> {
       
        async function loadData(){
            try {
                await fetchProductList();
                const storedToken = localStorage.getItem("token");
                if(storedToken){
                    setToken(storedToken);
                    await loadCartData(storedToken);
                    await loadLikedData(storedToken);
                    await fetchUserData(storedToken);
                }
                // For guests, hydrate cart from localStorage AFTER product list is loaded
                if(!storedToken){
                    try{
                        const raw = localStorage.getItem("cartItems");
                        const localCart = raw ? JSON.parse(raw) : {};
                        setCartItems(localCart);
                    }catch(e){
                        // ignore
                    }
                }
            } catch (error) {
                console.log("Error loading data:", error);
                // Set empty product list to prevent crash
                setProductList([]);
            }
        }
        loadData();
   },[])

   // Persist cart to localStorage whenever it changes
   useEffect(() => {
        try {
            // Remove zero or negative quantities before saving
            const cleaned = {};
            Object.keys(cartItems || {}).forEach((key) => {
                if (cartItems[key] > 0) cleaned[key] = cartItems[key];
            });
            localStorage.setItem("cartItems", JSON.stringify(cleaned));
        } catch (e) {
            // no-op
        }
   }, [cartItems])

    const contextValue = {
        product_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        userData,
        setUserData,
        fetchUserData,
        likedItems,
        toggleLike
    }


    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}   
        </StoreContext.Provider>
    )
 }

 export default StoreContextProvider;
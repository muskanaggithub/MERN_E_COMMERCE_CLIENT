import React, { useEffect, useState } from 'react'
import AppContext from './AppContext'
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';

const AppState = (props) => {

    const url = "https://mern-e-commerce-api-1-l64b.onrender.com/api";

    const [products, setProducts] = useState([])
    const [token, setToken] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const [user, setUser] = useState()
    const [cart, setCart] = useState([])
    const [reload, setReload] = useState(false)
    const [userAddress, setUserAddress] = useState("")
    const [userOrder, setUserOrder] = useState([])

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const api = await axios.get(`${url}/product/all`, {
                    headers: {
                        "Content-Type": "Application/json"
                    },
                    withCredentials: true
                });

                console.log(api.data.products);
                setProducts(api.data.products);
                setFilteredData(api.data.products);
                userProfile();
            } catch (error) {
                console.error("Error fetching products:", error);
            }

        };
        getAddress();
        fetchProduct();
        userCart();
        user_Order();
    }, [token, reload]);

    useEffect(() => {
        let lstoken = localStorage.getItem('token')
        // console.log("is token",lstoken)
        if (lstoken) {
            setToken(lstoken)
            setIsAuthenticated(true)
        }
        // setToken(localStorage.getItem('token'))
    }, [])


    // User register
    const register = async (name, email, password) => {
        const api = await axios.post(`${url}/user/register`, { name, email, password }, {
            headers: {
                "Content-Type": "Application/json"
            },
            withCredentials: true
        });
        toast.success(api.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        // alert(api.data.message);
        // console.log("User Register", api);
        return api.data;
    }

    // User login
    const login = async (email, password) => {
        const api = await axios.post(`${url}/user/login`, { email, password }, {
            headers: {
                "Content-Type": "Application/json"
            },
            withCredentials: true
        });
        toast.success(api.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        // alert(api.data.message);
        // console.log("User login", api.data);
        setToken(api.data.token)
        setIsAuthenticated(true)
        localStorage.setItem('token', api.data.token)
        return api.data;
    }
    // logout user
    const logout = () => {
        setIsAuthenticated(false)
        setToken("")
        localStorage.removeItem('token')
        toast.success("logout successfully...", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    }

    // user profile
    const userProfile = async () => {
        try {
            const api = await axios.get(`${url}/user/profile`, {
                headers: {
                    "Content-Type": "Application/json",
                    "Auth": token
                },
                withCredentials: true
            });

            setUser(api.data.user)
            setIsAuthenticated(true)
            // console.log("user profile=",api.data);
            // setProducts(api.data.products);
            // setFilteredData(api.data.products)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Add to cart
    const addToCart = async (productId, title, price, qty, imgSrc) => {
        try {
            // console.log(token);
            const api = await axios.post(`${url}/cart/add`,
                { productId, title, price, qty, imgSrc },
                {
                    headers: {
                        "Content-Type": "Application/json",
                        "Auth": token
                    },
                    withCredentials: true
                }

            );
            setReload(!reload)
            // console.log("my cart", api)
            toast.success(api.data.message, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // user cart
    const userCart = async () => {
        try {
            // console.log(token);
            const api = await axios.get(`${url}/cart/user`,
                {
                    headers: {
                        "Content-Type": "Application/json",
                        "Auth": token
                    },
                    withCredentials: true
                }
            );
            // console.log("user cart=", api.data.cart)
            setCart(api.data.cart)
            // setUser("user cart",api)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // --qty
    const decreaseQty = async (productId, qty) => {
        try {
            // console.log(token);
            const api = await axios.post(`${url}/cart/--qty`, { productId, qty },
                {
                    headers: {
                        "Content-Type": "Application/json",
                        "Auth": token,
                    },
                    withCredentials: true
                }
            );
            setReload(!reload)
            console.log("decrease cart items=", api)
            toast.success(api.data.message, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            // setCart(api.data.cart)
            // setUser("user cart",api)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // remove item from cart cart
    const removeFromCart = async (productId) => {
        try {
            // console.log(token);
            const api = await axios.delete(`${url}/cart/remove/${productId}`,
                {
                    headers: {
                        "Content-Type": "Application/json",
                        "Auth": token,
                    },
                    withCredentials: true
                }
            );
            setReload(!reload)
            // console.log("remove item from cart=", api)
            toast.success(api.data.message, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            // setCart(api.data.cart)
            // setUser("user cart",api)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // clear cart

    const clearCart = async () => {
        try {
            // console.log(token);
            const api = await axios.delete(`${url}/cart/clear/`,
                {
                    headers: {
                        "Content-Type": "Application/json",
                        "Auth": token,
                    },
                    withCredentials: true
                }
            );
            setReload(!reload)
            // console.log("remove item from cart=", api)
            toast.success(api.data.message, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            // setCart(api.data.cart)
            // setUser("user cart",api)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // add shipping address

    const shippingAddress = async (fullName, address, state, city, country, pincode, phoneNumber) => {
        try {
            // console.log(token);
            const api = await axios.post(`${url}/address/add/`,
                { fullName, address, city, state, country, pincode, phoneNumber },
                {
                    headers: {
                        "Content-Type": "Application/json",
                        "Auth": token,
                    },
                    withCredentials: true
                }
            );
            setReload(!reload)
            // console.log("remove item from cart=", api)
            toast.success(api.data.message, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return api.data
            // setCart(api.data.cart)
            // setUser("user cart",api)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // get user latest address
    const getAddress = async () => {
        try {
            const api = await axios.get(`${url}/address/get`, {
                headers: {
                    "Content-Type": "Application/json",
                    Auth: token
                },
                withCredentials: true
            });

            // console.log("user address",api.data);
            setUserAddress(api.data.userAddress)

        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };



    // get user order

    const user_Order = async () => {
        try {
            const api = await axios.get(`${url}/payment/userorder`, {
                headers: {
                    "Content-Type": "Application/json",
                    Auth: token,
                },
                withCredentials: true
            });

            // console.log("user order",api.data);
            setUserOrder(api.data)

        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    console.log("user order = ", userOrder);




    return (<AppContext.Provider value={{ products, register, login, url, token, setIsAuthenticated, isAuthenticated, filteredData, setFilteredData, logout, user, addToCart, cart, decreaseQty, removeFromCart, clearCart, shippingAddress, userAddress, userOrder, }}>{props.children}
    </AppContext.Provider>
    );
};
export default AppState;

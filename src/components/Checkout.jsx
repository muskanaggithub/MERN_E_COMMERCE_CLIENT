import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../context/AppContext'
import axios from 'axios'
import TableProduct from './TableProduct';
import { useNavigate } from "react-router-dom";



const Checkout = () => {
  const { cart, userAddress, url, user,clearCart } = useContext(AppContext);
  const [qty, setQty] = useState(0)
  const [price, setPrice] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    let qty = 0;
    let price = 0;
    if (cart?.items) {
      for (let i = 0; i < cart.items?.length; i++) {
        qty += cart.items[i].qty
        price += cart.items[i].price
      }
    }

    setPrice(price)
    setQty(qty)

  }, [cart])

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(`${url}/payment/checkout`, {
        amount: price,
        qty:qty,
        cartItems: cart?.items,
        userShipping: userAddress,
        userId: user._id,

      })
      // console.log("order response", orderResponse)
      const {orderId,amount:orderAmount}= orderResponse.data


       var options = {
        key: 'rzp_test_RpraLQBYdWMyDx', // Replace with your Razorpay key_id
        amount: orderAmount*100, // Amount is in currency subunits.
        currency: 'INR',
        name: 'Muskan Agarwal',
        description: 'Muskan Agarwal',
        order_id: orderId, // This is the order_id created in the backend
        callback_url: 'http://localhost:3000/payment-success', // Your success URL
        handler:async function (response){
          const paymentData ={
            orderId : response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount:orderAmount,
            orderItems:cart?.items,
            userId:user._id,
            userShipping:userAddress
          } 

          const api = await axios.post(`${url}/payment/verify-payment`,paymentData);

          if(api.data.success){
             clearCart();
             navigate('/orderconfirmation')
          
          }



          console.log("razorpay res",api.data)


          
          
        },
        prefill: {
          name: 'Muskan Agarwal',
          email: 'muskanagarwal1901@gmail.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
      };
      const rzp = new window.Razorpay(options);
       rzp.open();



    } catch (error) {
      console.log(error)

    }
  }



 useNavigate();


  //  useEffect(() => {
  //   console.log("User Address", userAddress);
  // }, [userAddress]);


  return (
    <>
      <div className="container my-3">
        <h1 className="text-center">Order Summary</h1>



        <table className="table table-bordered border-primary bg-dark">
          <thead className="bg-dark">
            <tr>
              <th scope="col" className="bg-dark text-light text-center">Product Details</th>
              <th scope="col" className="bg-dark text-light text-center">Shipping Address</th>
            </tr>
          </thead>
          <tbody className="bg-dark">
            <tr>
              <td className="bg-dark text-light">

                <TableProduct cart={cart} />
              </td>
              <td className="bg-dark text-light">
                <ul style={{ fontWeight: 'bold' }}>
                  <li>Name : {" "}{userAddress?.fullName}</li>
                  <li>Phone : {" "}{userAddress?.phoneNumber}</li>
                  <li>Country :{" "} {userAddress?.country}</li>
                  <li>State :{" "} {userAddress?.state}</li>
                  <li>Pincode :{" "} {userAddress?.pincode}</li>
                  <li>Near By :{" "}{userAddress?.address}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>


      </div>
      <div className="container text-center my-5">
        <button className='btn btn-secondary btn-lg' style={{ fontWeight: 'bold' }}
        onClick={handlePayment}>Proceed to Pay</button>
      </div>
    </>
  )
}

export default Checkout;
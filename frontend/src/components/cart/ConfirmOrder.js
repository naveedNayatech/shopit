import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MetaData from '../layouts/MetaData';
import CheckoutSteps from '../cart/CheckoutSteps';

const ConfirmOrder = ({ history }) => {

    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    
    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    const tax = Number((0.05 * itemsPrice).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + tax;

    const proceedtoPayment = () => {
        const data = {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice,
            tax,
            totalPrice,
        }
        sessionStorage.setItem('orderInfo', JSON.stringify(data));
        
        history.push('/payment'); 
    }
    return (
        <Fragment>
            <MetaData title={'Confirm Order | ShopIT'} />
            <CheckoutSteps shipping confirmOrder />

            <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-confirm">

                <h4 className="mb-3">Shipping Info</h4>
                <p><b>Name:</b> {user && user.name}</p>
                <p><b>Phone No :</b> {shippingInfo && shippingInfo.phoneNo}</p>
                <p><b>Email:</b> {user && user.email}</p>
                <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>
                
                <hr />
                <h4 className="mt-4">Your Cart Items:</h4>
                {cartItems && cartItems.map(cart => (
                    <Fragment>
                        <hr />
                        <div className="cart-item my-1" key={cart.product}>
                            <div className="row">
                                <div className="col-4 col-lg-2">
                                    <img src={cart.image} alt={cart.name} height="45" width="65" />
                                </div>

                                <div className="col-5 col-lg-6">
                                    <a href="#">{cart.name}</a>
                                </div>


                                <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                    <p>{cart.quantity} x ${cart.price} = <b>$ {cart.quantity * cart.price}</b></p>
                                </div>

                            </div>
                        </div>
                        <hr />

                    </Fragment>
                ))}

            </div>
			
			<div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal:  <span className="order-summary-values">$ {(itemsPrice).toFixed(2)}</span></p>
                        <p>Shipping: <span className="order-summary-values">$ {shippingPrice}</span></p>
                        <p>Tax:  <span className="order-summary-values">$ {tax}</span></p>

                        <hr />

                        <p>Total: <span className="order-summary-values">$ {(totalPrice).toFixed(2)}</span></p>

                        <hr />
                        <button id="checkout_btn" className="btn btn-primary btn-block" onClick={proceedtoPayment}>Proceed to Payment</button>
                    </div>
                </div>
        </div>


        </Fragment>
    )
}

export default ConfirmOrder

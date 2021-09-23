import React, {Fragment, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, updateOrder, clearErrors } from '../../actions/orderAction';
import Sidebar from './Sidebar';
import { UPDATE_ORDERS_RESET } from '../../constants/orderConstants';



const ProcessOrder = ({ match, history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, order  } = useSelector(state => state.orderDetails || '');

    const { updateError } = useSelector(state => state.product);
    const { error, isUpdated } = useSelector(state => state.order);


    const orderId = match.params.id;

    const [status, setStatus] = useState('');


    useEffect(() => {        
        
        dispatch(getOrderDetails(orderId));


        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if(updateError){
            alert.error(updateError);
            dispatch(clearErrors());
        }

        if(isUpdated === true){
            history.push('/admin/orders');
            alert.success('Order Status Updated');
            dispatch({
                type: UPDATE_ORDERS_RESET 
            });
        }
    }, [dispatch, alert, updateError, error, isUpdated, orderId]);

    const updateOrderHandler = (id) => {
    
        const formData = new FormData();
        formData.set('status', status);

        dispatch(updateOrder(id, formData));
    }

    const shippingDetails = order && `${order?.shippingInfo?.address},${order?.shippingInfo?.country},${order?.shippingInfo?.postalCode},${order.shippingInfo?.country}`; 
    const isPaid = order && order?.paymentInfo?.status === 'succeeded' ? true : false;

    return (
        <Fragment>
            <MetaData title={`Process Order # ${orderId}`} />

             <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>    

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h2 className="my-5"> Order Details </h2>
                        <hr />
                        { loading ? <Loader /> : (
                            <div className="row d-flex justify-content-around">
                            <div className="col-12 col-lg-7 order-details">
        
                                <h1 className="my-5">Order # {orderId}</h1>
        
                                <h4 className="mb-4">Shipping Info</h4>
                                <p><b>Name:</b> {order && order?.user?.name}</p>
                                <p><b>Phone:</b> {order && order?.shippingInfo?.phoneNo}</p>
                                <p className="mb-4"><b>Address:</b> {shippingDetails}</p>
                                <p><b>Amount:</b> $ {order  && order.totalPrice}</p>
        
                                <hr />
        
                                <h4 className="my-4">Payment</h4>
                                <p className={isPaid ? 'greenColor' : 'redColor'}><b>{isPaid ? 'PAID' : 'NOT PAID'}</b></p>
                                
                                <h4 className="my-4">Stripe ID</h4>
                                <p ><b>{order && order?.paymentInfo?.id}</b></p>
        
        
                                <h4 className="my-4">Order Status:</h4>
                                <p className={order && String(order.orderStatus).includes('Delivered') ? 'greenColor' : 'redColor'}>{order.orderStatus}</p>

        
        
                                <h4 className="my-4">Order Items:</h4>
        
                                <hr />



                                <div className="cart-item my-1">
                                {order && order?.orderItems?.map(item => (
                                            <div className="row my-5">
                                                <div className="col-4 col-lg-2">
                                                    <img src={item?.image} alt={item?.name} height="45" width="65" />
                                                </div>
        
                                                <div className="col-5 col-lg-5">
                                                    <a href="#">{item?.name}</a>
                                                </div>
        
        
                                                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                    <p> Price: ${item?.price} </p>
                                                </div>
        
                                                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                    <p>{item?.quantity} Piece(s)</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <hr />
                            </div>

                            {order.orderStatus !== 'Delivered' ? (
                            <div className="col-12 col-lg-3 mt-5">
                                    <h4 className="my-4">Status</h4>

                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name='status'
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>

                                    <button className="btn btn-primary btn-block" onClick={() => updateOrderHandler(order?._id)}>
                                        Update Status
                                </button>
                            </div>
                            ) : <div className="col-12 col-lg-3 ">
                                <img src="/images/delivered.PNG" alt="delivered" width="300" />
                            </div> }        
                            
                            
                        </div>                           
                        ) }
                    </Fragment>
                </div>
             </div>   
        </Fragment>
    )
}

export default ProcessOrder

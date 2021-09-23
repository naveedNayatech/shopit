import React, {Fragment, useEffect} from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import { MDBDataTable } from 'mdbreact';
import Loader from '../layouts/Loader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { allOrders, clearErrors } from '../../actions/orderAction';
import Sidebar from './Sidebar';

const OrdersList = ({history}) => {


    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders} = useSelector(state => state.allOrders);

    useEffect(() => {
        dispatch(allOrders());

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        // if(isDeleted){
        //     alert.success('Product Deleted');
        //     history.push('/admin/products');
        //     dispatch({
        //         type: DELETE_PRODUCT_RESET
        //     });
        // }

    }, [dispatch, alert, error, history]);

    const setOrders = () => {
        const data =  { 
            columns: [
                {
                    label: 'OrderID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'No of Items',
                    field: 'numOfItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
                },
                {
                    label: 'Payment',
                    field: 'payment',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                }
            ], 
            rows: [] 
        }

        orders && orders.forEach(order => {
            data.rows.push({
                id: order?._id,
                numOfItems: order?.orderItems?.length,
                amount: `$${order?.totalPrice}`,
                status: order?.orderStatus && String(order?.orderStatus).includes('Delivered') ? <div style={{backgroundColor:'#F72C08', overflow: 'hidden',}}><p style={{color:'#FFF', textAlign:'center'}}>{order?.orderStatus}</p></div> : <div style={{backgroundColor:'#246224', overflow: 'hidden',}}><p style={{color: '#FFF', textAlign:'center'}}>{order?.orderStatus}</p></div>,
                payment: order?.paymentInfo?.status,
                actions: <Fragment>
                    <Link to={`/admin/order/${order?._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-eye"></i>
                    </Link>  

                    <button className="btn btn-danger py-1 px-2 ml-2">
                        <i className="fa fa-trash"></i>
                    </button>
                    </Fragment>
            })            
        });

        return data;
    }

    return (
        <Fragment>
            <MetaData title={'All Orders | Admin '} />

             <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>    

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5"> All Orders </h1>
                        { loading ? <Loader /> : (
                            <MDBDataTable
                                data={setOrders()}
                                className="px-3"
                                bordered
                                striped
                                hover
                                responsive
                            />
                        ) }
                    </Fragment>
                </div>
             </div>   
        </Fragment>
    )
}

export default OrdersList

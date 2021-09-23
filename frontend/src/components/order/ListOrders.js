import React, {Fragment, useEffect} from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import { MDBTable, MDBTableBody, MDBTableHead, MDBDataTable } from 'mdbreact';
import Loader from '../layouts/Loader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { myOrders, clearErrors } from '../../actions/orderAction';

const ListOrders = () => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders} = useSelector(state => state.myOrders);

    useEffect(() => {
        dispatch(myOrders());

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error]);

    const setOrders = () => {
        const data = { 
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Num of Items',
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
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                }
            ], 
            rows: []
        }

        orders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`, 
                status: order.orderStatus && String(order.orderStatus).includes('Delivered') ? <div style={{backgroundColor:'#F72C08', overflow: 'hidden',}}><p style={{color:'#FFF', textAlign:'center'}}>{order.orderStatus}</p></div> : <div style={{backgroundColor:'#246224', overflow: 'hidden',}}><p style={{color: '#FFF', textAlign:'center'}}>{order.orderStatus}</p></div>,
                actions: <Link to={`/order/${order._id}`} className="btn" style={{color: 'dodgerblue'}}><i className="fa fa-eye"></i></Link>  
            })            
        });

        return data
    }

    return (
        <Fragment>
            <MetaData title={'My Orders '} />
            <h1 className="my-5">My Orders</h1>

            { loading ? <Loader /> : 
            
            <MDBDataTable 
                data={setOrders()} 
                bordered
                striped
                materialSearch  
                small
                responsive
            />
            }

            {/* <MDBTable bordered hover responsive>
            <MDBTableHead>
                <tr style={{backgroundColor: '#D2A527', color: '#FFF'}}>
                <th>ID</th>
                <th>Num of Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
                </tr>
            </MDBTableHead>
            
            <MDBTableBody>
            {orders && orders.map(order => (
                <tr>
                <td>{order._id}</td>
                <td>{order.orderItems.length}</td>
                <td>{`$${order.totalPrice}`}</td>
                <td style={{backgroundColor: order.orderStatus === 'Delivered' ? 'green' : 'red', color: '#FFF', textAlign: 'center'}}><p>{order.orderStatus}</p></td>
                <td><Link to={`/order/${order._id}`} className="btn btn-info"><i className="fa fa-eye"></i></Link></td> 
                </tr>
            ))}
            </MDBTableBody> 
    </MDBTable> */}
        </Fragment>
    )
}

export default ListOrders

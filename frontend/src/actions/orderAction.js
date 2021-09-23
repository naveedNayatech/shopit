import { 
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    UPDATE_ORDERS_REQUEST,
    UPDATE_ORDERS_SUCCESS,
    UPDATE_ORDERS_FAIL,
    UPDATE_ORDERS_RESET,
    CLEAR_ERRORS
} from '../constants/orderConstants';

import axios from 'axios';

export const createOrder = (order) => async(dispatch, getState) => {
    try {
        dispatch({
            type: CREATE_ORDER_REQUEST,
        })
        
        const config = {
            headers : {
                'CONTENT-TYPE': 'application/json '
            }
        }

        const { data } = await axios.post('/api/v1/order/new', order, config)

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get currently logged in user order
export const myOrders = () => async(dispatch) => {
    try {
        dispatch({type: MY_ORDERS_REQUEST})

        const { data } = await axios.post(`/api/v1/order/mine`);

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data.order
        })


    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get Order Details 
export const getOrderDetails = (id) => async(dispatch) => {

    console.log('Getting order details ' + id);
    
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST});
        
        const { data } = await axios.get(`/api/v1/order/${id}`);

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.order,
        })

    } catch (error) {
        dispatch({ 
            type: ORDER_DETAILS_FAIL, 
            payload: error.response.data.message
        });
    }   
}

// Get Orders (Admin) 
export const allOrders = () => async(dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST});

        
        const { data } = await axios.post(`/api/v1/admin/orders`);

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({ 
            type: ALL_ORDERS_FAIL, 
            payload: error.response.data.message
        });
    }   
}

// Update Order - (ADMIN)
export const updateOrder = (id, orderData) => async(dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDERS_REQUEST});

        const config = {
            headers: { 
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData, config);

        dispatch({
            type: UPDATE_ORDERS_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({ 
            type: UPDATE_ORDERS_FAIL, 
            payload: error.response.data.errMessage
        });
    }   
}

// Clear Errors
export const clearErrors = () => async( dispatch ) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}

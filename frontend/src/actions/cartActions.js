import axios from 'axios';

import { 
    ADD_TO_CART, 
    REMOVE_TO_CART,
    SAVE_SHIPPING_INFO
} from '../constants/CartConstants';

export const addItemToCart = (id, quantity) => async(dispatch, getState) => {
    try {
        const { data } = await axios.get(`/api/v1/product/${id}`)

        dispatch({
            type: ADD_TO_CART,
            payload: { 
                product: data.product._id,
                name: data.product.name,
                price: data.product.price,
                image: data.product.images[0].url,
                stock: data.product.stock,
                quantity
            }
        })

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    } catch (error) {
        
    }
}

export const removeItemToCart = (id) => async(dispatch, getState) => {
    try {
        const { data } = await axios.get(`/api/v1/product/${id}`)

        dispatch({
            type: REMOVE_TO_CART,
            payload: id
        })

        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    } catch (error) {
        
    }
}

// Save Shipping Info
export const saveShippingInfo = (data) => async(dispatch) => {
    
        dispatch({
            type: SAVE_SHIPPING_INFO,
            payload: data
        })

        localStorage.setItem('shippingInfo', JSON.stringify(data))
}


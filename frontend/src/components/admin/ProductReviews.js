import React, {Fragment, useState, useEffect} from 'react';
import MetaData from '../layouts/MetaData';
import { MDBDataTable } from 'mdbreact';
import Loader from '../layouts/Loader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews, clearErrors } from '../../actions/productActions';
import Sidebar from './Sidebar';
import { useHistory } from "react-router-dom";

const ProductReviews = () => {  

    const [productId, setProductId] = useState('');
    let history = useHistory();
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, reviews } = useSelector(state => state.productReviews);

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        // if(productId !== ''){
        //     dispatch(getProductReviews(productId))
        // }

    }, [dispatch, alert, error, productId]);

    const submitHandler = (e) => {
        e.preventDefault();
        console.log('Hello Submit Handker');
        console.log('id is ' + productId);
        dispatch(getProductReviews(productId));
    }

    const setReviews = () => {
        const data =  { 
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc'
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc'
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                }
            ], 
            rows: [] 
        }

        reviews && reviews.forEach(review => {
            data.rows.push({
                id: review?._id,
                rating: review?.name,
                comment: review?.comment,
                user: review?.name,
                actions: <Fragment>
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
            <MetaData title={'Product Review | Admin '} />

             <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>    

                <div className="col-12 col-md-10">
                <Fragment>    
                <div className="row justify-content-center mt-5">
			        <div className="col-5">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label htmlFor="productId_field">Enter Product ID</label>
                                <input
                                    type="text"
                                    id="productId_field"
                                    className="form-control"
                                    required
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                />
                            </div>

                            <button
                                id="search_button"
                                type="submit"
                                className="btn btn-primary btn-block py-2"
                            >
                                SEARCH
                            </button>
                        </ form>
                       </div> 
                    </div>
                </Fragment>

                {reviews && reviews.length > 0 ? (
                    <MDBDataTable 
                        data={setReviews()}
                        className="px-3"
                        bordered
                        striped
                        responsive
                        />
                ) : (
                    <p className="pt-5 text-center ">No Reviews</p>
                ) }
                
            </div>
        </div>   
    </Fragment>
    )
}

export default ProductReviews

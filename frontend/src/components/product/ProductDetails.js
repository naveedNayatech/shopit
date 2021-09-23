import React, {Fragment, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, newReview, clearErrors } from '../../actions/productActions';
import { addItemToCart } from '../../actions/cartActions';
import ListReviews from '../../components/review/ListReviews';
import { useAlert } from 'react-alert';
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import { Carousel } from 'react-bootstrap';
import { NEW_REVIEW_RESET } from '../../constants/productConstant';

const ProductDetails = ({ match }) => {
 
    const dispatch = useDispatch();
    const alert = useAlert();

    const [quantity, setQuantity] = React.useState(1);
    const [rating, setRating] = React.useState(0);
    const [comment, setComment] = React.useState('');

    const { loading, error, product} = useSelector(state => state.productDetails);
    const { user } = useSelector(state => state.auth);
    const { error: reviewError, success } = useSelector(state =>state.newReview);
    
    useEffect(() => {
        dispatch(getProductDetails(match.params.id));

        if(error) {
             alert.error(error);
             dispatch(clearErrors())
        }

        if(reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors())
        }

        if(success) {
            alert.success('Review Posted Successfully');
            dispatch({
                type: NEW_REVIEW_RESET 
            })
        }

    }, [dispatch, alert, error, reviewError, success, match.params.id]) //if anything changes, then useEffect will call.

    const addToCart = () => {
        dispatch(addItemToCart(match.params.id, quantity));
        alert.success('Item added to cart');
    }

    const increaseQuantity = () => {
        const count = document.querySelector('.count');
        
        if(count.valueAsNumber >= product.stock)  {
            console.log('Hello not moew than stock');
            alert.error(`Not more than ${count.valueAsNumber} in stock`);
            return
        };
        
        const qty = count.valueAsNumber++;
        setQuantity(qty)    

    }

    const decreaseQuantity = () => {
        const count = document.querySelector('.count');
        
        if(count.valueAsNumber <= 1) {
            alert.error('Quantity cannot be less than 1');
            return 
        }
        
        const qty = count.valueAsNumber--;
        setQuantity(qty)    
    }

    // This is vanilla javascript
    function setUserRatings() {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.starValue = index + 1;
        
        console.log('test');    
        
        ['click', 'mouseover', 'mouseout'].forEach(function(e) {
            star.addEventListener(e, showRatings);

        })    
     })

     function showRatings(e) {
         stars.forEach((star, index) => {
             if(e.type === 'click') {
                if(index < this.starValue) {
                    star.classList.add('orange');
                    setRating(this.starValue);

                } else {
                    star.classList.remove('orange')
                }
             }

             if(e.type === 'mouseover') {
                if(index < this.starValue) {
                    star.classList.add('yellow')
                } else {
                    star.classList.remove('yellow')
                }
            }

            if(e.type === 'mouseout') {
                star.classList.remove('yellow')
            }
         })

     }
    }

    const reviewHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', match.params.id);

        dispatch(newReview(rating, comment, match.params.id));
    }
    return (
        
        <Fragment>
            <MetaData title={product.name}/>
        {loading == false ? <Loader /> : (
            <Fragment>
            <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
                <Carousel pause='hover'>
                    {product.images && product.images.map(image => (
                        <Carousel.Item key={image.public_id}>
                            <img className="d-block w-100" src={image.url} alt={product.title}></img>
                        </Carousel.Item>
                    ))}
                </Carousel> 
            </div>

            <div className="col-12 col-lg-5 mt-5">
                <h3>{product.name}</h3>
                <p id="product_id">Product # {product._id}</p>

                <hr />

                <div className="rating-outer">
                    <div className="rating-inner" style={{width: `${(product.ratings / 5 ) * 100 }%`}}></div> 
                </div>
                <span id="no_of_reviews">({product.noOfReviews} Reviews)</span> 
                <hr />

                <p id="product_price">${product.price}</p>
                <div className="stockCounter d-inline">
                    <span className="btn btn-danger minus" onClick={decreaseQuantity}>-</span>

                    <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                    <span className="btn btn-primary plus" onClick={increaseQuantity}>+</span>
                </div>
                 <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" disabled={product.stock === 0 } onClick={addToCart}>Add to Cart</button>

                <hr />

                <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>{product.stock > 0 ? 'In Stock' : 'Out of Stock' }</span></p>

                <hr />

                <h4 className="mt-2">Description:</h4>
                <p>{product.description}</p>
                <hr />
                <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
				
                {user ? <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal" onClick={setUserRatings}>
                            Submit Your Review
                </button> : 
                     <div className="alert alert-danger mt-2" type="alert">Login to post your review</div>
                 }
				
				
				<div className="row mt-2 mb-5">
                    <div className="rating w-50">

                        <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">

                                        <ul className="stars" >
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                            <li className="star"><i className="fa fa-star"></i></li>
                                        </ul>

                                        <textarea name="review" id="review" className="form-control mt-3"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        >

                                        </textarea>

                                        <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close" onClick={reviewHandler}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        {product.reviews && product.reviews.length > 0 && (
            <ListReviews reviews = {product.reviews} />
        )}
             
 
        </Fragment>
        )}
        </Fragment>
    )
}

export default ProductDetails

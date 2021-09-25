import React from 'react'
import { Fragment, useEffect, useState } from 'react'
import MetaData from './layouts/MetaData';
import Loader from './layouts/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import Product from './product/Product';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Carousel } from 'react-bootstrap';
import $ from 'jquery';


const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);


const Home = ({ match }) => {

    const [currentPage, setCurrentPage] = useState(1);

    const [price, setPrice] = useState([1, 1000]);

    const [category, setCategory] = useState('');
    
    const [rating, setRating] = useState(0);

    const categories = [
        'Electronics',
                'Cameras',
                'Laptop',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoors',
                'Home'
    ]



    const alert = useAlert();

    const dispatch = useDispatch();

    const {loading, products, error, productsCount, resPerPage} = useSelector(state => state.products);

    const keyword = match.params.keyword;


    useEffect(() => {
        
        if(error){
           return alert.error(error);
        }

        dispatch(getProducts(keyword, currentPage, price, category, rating));

        
    }, [dispatch, alert, error, currentPage, keyword, price, category, rating]);

    function setCurrentPageNumber(pageNumber) {
        setCurrentPage(pageNumber);
    }

    return (
        <Fragment>
            {loading == true ? <Loader /> : (
                <Fragment>
                     <MetaData title={'Home'}/>
                        
                        {/* Carousel Slider */}
                        <div>
                            <Carousel pause='hover' className="carouselItems" id="carouselItems">
                                    <Carousel.Item key="01">
                                        <img className="d-block w-100" src="https://icms-image.slatic.net/images/ims-web/5dbbbfd5-5809-43b5-bdd5-77f92f5b17f3.png" alt="Slider_Image_01"></img>
                                    </Carousel.Item>

                                    <Carousel.Item key="02">
                                        <img className="d-block w-100" src="https://icms-image.slatic.net/images/ims-web/1db84e50-c786-4e0d-9eec-37f5c84876ad.jpg" alt="Slider_Image_02"></img>
                                    </Carousel.Item>
                            </Carousel> 
                        </div>

                        <div className="container container-fluid">
                            <h3 id="products_heading" className="latestProductHeading"><i className="fa fa-pencil roundedIcon" ></i> Latest Products</h3>
                        </div>
                        <section id="products" className="container mt-5">
                            <div className="row">

                                {keyword ? (
                                    <Fragment>
                                        <div className="col-6 col-md-3 mt-5 mb-5">
                                            <div className="px-5">
                                                <Range 
                                                    marks= {{
                                                        1: `${1}`,
                                                        1000: `${1000}`
                                                    }}
                                                    min={1} 
                                                    max={1000}
                                                    step={100}
                                                    dots={true}
                                                    dotStyle={{ borderColor: 'black' }}
                                                    handleStyle={{
                                                        backgroundColor: '#F95800',
                                                      }}
                                                    defaultValue={[1, 1000]}
                                                    tipFormatter={value => `$${value}`}
                                                    tipProps={{
                                                        placement: 'top',
                                                        visible: true,
                                                    }}
                                                    value={price}
                                                    onChange={price => setPrice(price)}
                                                />

                                                <hr className="my-5" />
                                                <div className="mt-5">
                                                    <h4 className="mb-3">
                                                        Categories
                                                    </h4>

                                                    <ul className="pl-0">
                                                        {categories.map(category => (
                                                            <li style={{cursor: 'pointer', listStyle: 'none'}} key={category} onClick={() => setCategory(category)}>
                                                                {category}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>


                                                <hr className="my-3" />
                                                <div className="mt-5">
                                                    <h4 className="mb-3">
                                                        Ratings
                                                    </h4>

                                                    <ul className="pl-0">
                                                        {[5, 4, 3, 2, 1].map(star => (
                                                            <li style={{cursor: 'pointer', listStyle: 'none'}} key={star} 
                                                            onClick={() => setRating(star)}>

                                                            <div className="rating-outer">
                                                                <div className="rating-inner" style={{
                                                                    width: `${star * 20 }%`,
                                                                    
                                                                }}>

                                                                </div>
                                                            </div>    
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
            

                                            </div>    
                                        </div>

                                        <div className="col-6 col-md-9">
                                            <div className="row">
                                            {products && products.map(product => (
                                            <Product key = {product._id} product={product} col={4} />    
                                        ))}
                                            </div>
                                        </div>
                                    </Fragment>
                                ): (
                                    products && products.map(product => (
                                        <Product key = {product._id} product={product} col={3}/>    
                                    )) 
                                )}
                                
                                
                            </div>
                        </section>   

                        {/* Pagination */}
                        {resPerPage <= productsCount && (
                            <div className="d-flex justify-content-center mt-5"> 
                            <Pagination activePage={currentPage} 
                             itemsCountPerPage={resPerPage} 
                             totalItemsCount = {productsCount}
                             onChange={setCurrentPageNumber} 
                             nextPageText = {'Next'}
                             prevPageText = {'Prev'}
                             firstPageText = {'First'}
                             lastPageText = {'Last'}
                             itemClass='page-item'
                             linkClass="page-link"
                            />           
                       </div>
                        )}            
                        
                </Fragment>
            )}
            
        </Fragment>

    )
}

export default Home

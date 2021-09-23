import React, {Fragment, useState, useEffect} from 'react';
import MetaData from '../layouts/MetaData';
import Loader from '../layouts/Loader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, clearErrors } from '../../actions/productActions';
import { NEW_PRODUCT_RESET} from '../../constants/productConstant';

import Sidebar from './Sidebar';

const NewProduct = ({ history }) => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Electronics');
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

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

    const { loading, error, success} = useSelector(state => state.newProduct);

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if(success){
            alert.success('Product Added');
            history.push('/admin/products');
            dispatch({
                type: NEW_PRODUCT_RESET
            });
        }
    }, [dispatch, alert, error, success, history]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('description', description);
        formData.set('category', category);
        formData.set('stock', stock);
        formData.set('seller', seller);
    
        images.forEach( image=> {
            formData.append('images', image)
        })

        if(price > 1000) {
            alert.error('Price Should be less than 1000');
            return;
        }

        if(stock <= 0) {
            alert.error('Stock Should Not be 0');
            return;
        }

        dispatch(createProduct(formData));

        // if(success){
        //     alert.success('Product Added');
        //     history.push('/admin/products');
        //     dispatch({
        //         type: NEW_PRODUCT_RESET
        //     });
        // }


    }

    const onChange = e => {

            const files = Array.from(e.target.files);

            setImagesPreview([]);  //clear images preview
            setImages([]);  //clear images preview

            files.forEach(file => {
                const reader = new FileReader();

                reader.onload = () => {
                    if(reader.readyState === 2){
                        setImagesPreview(oldArray => [...oldArray, reader.result]);
                        setImages(oldArray => [...oldArray, reader.result]);
                    }
                }
                reader.readAsDataURL(file);
            })
    }

    return (
        <Fragment>
            <MetaData title={"New Product"} />

            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                <div className="wrapper my-5"> 
                    <form className="shadow-lg" encType='multipart/form-data' onSubmit={submitHandler}>
                        <h1 className="mb-4">New Product</h1>

                        <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="form-control"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price_field">Price</label>
                            <input
                            type="text"
                            id="price_field"
                            required
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description_field">Description</label>
                            <textarea required className="form-control" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category_field">Category</label>
                            <select className="form-control" id="category_field" required value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categories.map((category => (
                                    <option key={category} value={category}>{category}</option>
                                )))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="stock_field">Stock</label>
                            <input
                            type="number"
                            id="stock_field"
                            required
                            className="form-control"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="seller_field">Seller Name</label>
                            <input
                            type="text"
                            required
                            id="seller_field"
                            className="form-control"
                            value={seller}
                            onChange={(e) => setSeller(e.target.value)}
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label>Images</label>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='customFile'
                                        required
                                        onChange={onChange}
                                        multiple
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Images
                                    </label>
                                </div>

                                {imagesPreview && imagesPreview.map(img => (
                                    <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />  
                                ))}
                        </div>

            
                        <button
                        id="login_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={ loading ? true : false}
                        >
                        CREATE
                        </button>
                    </form>
                </div>
                </div>
            </div>                
        </Fragment>
    )
}

export default NewProduct

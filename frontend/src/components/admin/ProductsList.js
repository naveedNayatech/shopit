import React, {Fragment, useEffect} from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import { MDBDataTable } from 'mdbreact';
import Loader from '../layouts/Loader';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts, deleteProduct, clearErrors } from '../../actions/productActions';
import Sidebar from './Sidebar';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstant';

const ProductsList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, products} = useSelector(state => state.products);
    const { error: deleteError, isDeleted } = useSelector(state => state.product);

    useEffect(() => {
        dispatch(getAdminProducts());

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if(deleteError){
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if(isDeleted){
            alert.success('Product Deleted');
            history.push('/admin/products');
            dispatch({
                type: DELETE_PRODUCT_RESET
            });
        }

    }, [dispatch, alert, error, deleteError, isDeleted]);

    const setProducts = () => {
        const data =  { 
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'stock',
                    field: 'stock',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                }
            ], 
            rows: [] 
        }

        products && products.forEach(product => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock, 
                status: product.productStatus && String(product.productStatus).includes('Delivered') ? <div style={{backgroundColor:'#F72C08', overflow: 'hidden',}}><p style={{color:'#FFF', textAlign:'center'}}>{product.productStatus}</p></div> : <div style={{backgroundColor:'#246224', overflow: 'hidden',}}><p style={{color: '#FFF', textAlign:'center'}}>{product.productStatus}</p></div>,
                actions: <Fragment>
                    <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>  

                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteProductHandler(product._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                    </Fragment>
            })            
        });

        return data;
    }

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
    }

    return (
        <Fragment>
            <MetaData title={'All Products | Admin '} />

             <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>    

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5"> All Products </h1>
                        { loading ? <Loader /> : (
                            <MDBDataTable
                                data={setProducts()}
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

export default ProductsList

import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import Header from './components/layouts/Header';
import Home from './components/Home';
import ProtectedRoute from './components/route/ProtectedRoute';
import ProductDetails from './components/product/ProductDetails'
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import Footer from './components/layouts/Footer';
import UpdateProfile from './components/Auth/UpdateProfile';
import UpdatePassword from './components/Auth/UpdatePassword';
import ForgotPassword from './components/Auth/ForgotPassword';
import NewPassword from './components/Auth/NewPassword';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { loadUser } from './actions/authActions';
import Cart from './components/cart/Cart';
import Shipping from './components/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import ProductReviews from './components/admin/ProductReviews';
import store from './store';
import axios from 'axios';

// Payments
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  
  useEffect(() => {
    store.dispatch(loadUser());
    async function getStripeApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');
      setStripeApiKey(data.stripeApiKey);
    }
    getStripeApiKey();
  }, [])

  return ( 
    <Router>
      <div className="App">
        <Header />  
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/login" component={Login} exact/>
          <ProtectedRoute path="/me" component={Profile} exact/>
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact/>
          <ProtectedRoute path="/password/update" component={UpdatePassword} exact/>
          <Route path="/password/forgot" component={ForgotPassword} exact/>
          <Route path="/password/reset/:token" component={NewPassword} exact/>
          <Route path="/register" component={Register} exact/>
          <Route path="/product/:id" component={ProductDetails} exact />
          <Route path="/cart" component={Cart} exact />
          <ProtectedRoute path="/shipping" component={Shipping} exact />
          <ProtectedRoute path="/confirm" component={ConfirmOrder} exact />
          <ProtectedRoute path="/success" component={OrderSuccess} exact />
          <ProtectedRoute path="/orders/me" component={ListOrders} exact />
          <ProtectedRoute path="/order/:id" component={OrderDetails} exact/>
  

          {stripeApiKey && 
          <Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRoute path="/payment" component={Payment} exact />
          </Elements>
          }
        </div>

        <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact/>
        <ProtectedRoute path="/admin/products" isAdmin={true} component={ProductsList} exact/>
        <ProtectedRoute path="/admin/addProduct" isAdmin={true} component={NewProduct} exact/>
        <ProtectedRoute path="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact/>
        <ProtectedRoute path="/admin/orders" isAdmin={true} component={OrdersList} exact/>
        <ProtectedRoute path="/admin/order/:id" isAdmin={true} component={ProcessOrder} exact/>
        <ProtectedRoute path="/admin/users" isAdmin={true} component={UsersList} exact/>
        <ProtectedRoute path="/admin/reviews" isAdmin={true} component={ProductReviews} exact/>
          
        
        {isAuthenticated && user?.role === 'admin' ? null : <Footer />}
          
      </div>
    </Router>
  ); 
}

export default App;

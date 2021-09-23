const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
// const dotenv = require('dotenv');
const path = require('path');

// Cloudinary
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
// Cloudinary


const errorMiddleware = require('./middlewares/errors');

const cookieParser = require('cookie-parser');


// dotenv.config({ path: './config/config.env'})
if(process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: './config/config.env'})


app.use(express.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(fileUpload());


// Setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


// Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');


app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use('/api/v1', payment);  


if(process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    })
}


// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app
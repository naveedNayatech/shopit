const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');

// create new product => /api/v1/product/new
exports.newProduct = catchAsyncErrors (async (req, res, next) => {

    let images = [];

    if(typeof req.body.images === 'string') {
        images.push(req.body.images);
    }   else {
        images = req.body.images
    }

    let imagesLinks = [];

    for(let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products',
        })

        imagesLinks.push({ 
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    
    
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// Get all products => /api/v1/products
exports.getProducts = catchAsyncErrors( async(req, res, next ) => {
    
    const resPerPage = 8;
    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find().sort({_id: -1}), req.query)
                    .search() 
                    .filter()
                    .pagination(resPerPage)

    const products = await apiFeatures.query;

    res.status(201).json({
        success: true,
        productCount,
        resPerPage,
        products
    })
})


// Get all admin products => /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors( async(req, res, next ) => {

    const products = await Product.find().sort({_id: -1});

    res.status(201).json({
        success: true,
        products
    })
})


// Get Single Product Details => /api/v1/products/:id
exports.getSingleProduct = catchAsyncErrors(async(req, res, next ) => {

    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product Not Found', 404))
    }

    res.status(201).json({
        success: true,
        count: product.length,
        product
    })
})


//update Product => /api/v1/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product Not Found', 404))
    }

    let images = [];

    if(typeof req.body.images === 'string') {
        images.push(req.body.images);
    }   else {
        images = req.body.images    
    }


    if(images !== undefined){     
        // Deleting Images associated with product
        for(let i = 0; i < product.images.length; i++){
        const result = await cloudinary.v2.uploader .destroy(product.images[i].public_id)
      }
    }

    let imagesLinks = [];

    if(images !== undefined){
    for(let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products',
        });

        imagesLinks.push({ 
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    })
}) 

// Delete Product => /api/v1/admin/product/:id

exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id);
    
    if(!product) {
        return next(new ErrorHandler('Product Not Found', 404))
    }

    // Deleting Images associated with product 
    for(let i = 0; i < product.images.length; i++){
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: 'Product Deleted'
    })
})

// Review
// Create New Review => /api/v1/reviews
exports.createReview = catchAsyncErrors(async(req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString()) //if user already reviewed this product, we simply update his/her review

    if(isReviewed) {
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
    })
})

// Get Product Reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async(req, res, next) => {
    
    try {
    const product = await Product.findById(req.query.id);

    if(product){
        res.status(200).json({
            success: true,
            reviews: product.reviews
        })  
    } else {
        res.status(500).json({
            success: false,
            message: 'Invalid Product ID'
        })
    }
    } catch (error) {
        console.log('I am in a catch block');
        if(error && error.name === 'CastError');
        res.status(200).json({
            success: false,
            message: 'Invalid ID'
        });


    }
})

// Delete Product Reviews => /api/v1/reviews
exports.deleteReviews = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.productId);
    
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success: true,
    })
})


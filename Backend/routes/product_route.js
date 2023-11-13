
const express = require('express');
// const expressAsyncHandler = require('express-async-handler');
// const Product = require('../models/productModel.js');
const expressAsyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const auth = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/utils');



const productRouter = express.Router();

productRouter.get('/products', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

// productRouter.post(
//     '/products',
//     // isAuth,
//     auth,
//     isAdmin,
//     expressAsyncHandler(async (req, res) => {
//         const newProduct = new Product({
//             name: 'Name',
//             slug: 'sample-name-' + Date.now(),
//             image: '/images/p1.jpg',
//             price: 199,
//             category: 'Men',
//             brand: 'Raymond',
//             countInStock: 5,
//             rating: 0,
//             numReviews: 0,
//             description: 'Look your best in any situation with this stylish and versatile mens shirt.Made from high- quality materials, this shirt is soft to the touch and comfortable to wear all day long.It features a classic fit that flatters all body types, and a variety of colors and styles to choose from.',
//         });
//         const product = await newProduct.save();
//         res.send({ message: 'Product Created', product });
//     })
// );

productRouter.post(
    '/products',
    // isAuth,
    auth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { name, slug, price, image, category, brand, countInStock, description } = req.body;
        if (!name && !slug && !price && !image && !category && !brand && !countInStock && !description) {
            return res.status(400).json({ message: 'One or more mandatory fields are empty!' });
        }

        const newProduct = new Product({
            name: name,
            slug: slug,
            price: price,
            image: image,
            // images: images,
            category: category,
            brand: brand,
            countInStock: countInStock,
            rating: 0,
            numReviews: 0,
            description: description,
        });
        const product = await newProduct.save();
        res.send({ message: 'Product Created', product });
    })
);


productRouter.put(
    '/products/:id',
    // isAuth,
    auth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            product.name = req.body.name;
            product.slug = req.body.slug;
            product.price = req.body.price;
            // product.image = req.body.image;
            product.images = req.body.images;
            product.category = req.body.category;
            product.brand = req.body.brand;
            product.countInStock = req.body.countInStock;
            product.description = req.body.description;
            await product.save();
            res.send({ message: 'Product Updated' });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.put(
    '/products/photo/:id',
    // isAuth,
    auth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            // product.name = req.body.name;
            // product.slug = req.body.slug;
            // product.price = req.body.price;
            product.image = req.body.image;
            // product.images = req.body.images;
            // product.category = req.body.category;
            // product.brand = req.body.brand;
            // product.countInStock = req.body.countInStock;
            // product.description = req.body.description;
            await product.save();
            res.send({ message: 'Image Updated' });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.delete(
    '/products/:id',
    // isAuth,
    auth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.send({ message: 'Product Deleted' });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.post(
    '/products/:id/reviews',
    // isAuth,
    auth,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            if (product.reviews.find((x) => x.name === req.user.name)) {
                return res
                    .status(400)
                    .send({ message: 'You already submitted a review' });
            }

            const review = {
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((a, c) => c.rating + a, 0) /
                product.reviews.length;
            const updatedProduct = await product.save();
            res.status(201).send({
                message: 'Review Created',
                review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
                numReviews: product.numReviews,
                rating: product.rating,
            });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

const PAGE_SIZE = 3;

productRouter.get(
    '/products/admin',
    // isAuth,
    auth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const page = query.page || 1;
        const pageSize = query.pageSize || PAGE_SIZE;

        const products = await Product.find()
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        const countProducts = await Product.countDocuments();
        res.send({
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
        });
    })
);

productRouter.get(
    '/products/search',
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const pageSize = query.pageSize || PAGE_SIZE;
        const page = query.page || 1;
        const category = query.category || '';
        const price = query.price || '';
        const rating = query.rating || '';
        const order = query.order || '';
        const searchQuery = query.query || '';

        const queryFilter =
            searchQuery && searchQuery !== 'all'
                ? {
                    name: {
                        $regex: searchQuery,
                        $options: 'i',
                    },
                }
                : {};
        const categoryFilter = category && category !== 'all' ? { category } : {};
        const ratingFilter =
            rating && rating !== 'all'
                ? {
                    rating: {
                        $gte: Number(rating),
                    },
                }
                : {};
        const priceFilter =
            price && price !== 'all'
                ? {
                    // 1-50
                    price: {
                        $gte: Number(price.split('-')[0]),
                        $lte: Number(price.split('-')[1]),
                    },
                }
                : {};
        const sortOrder =
            order === 'featured'
                ? { featured: -1 }
                : order === 'lowest'
                    ? { price: 1 }
                    : order === 'highest'
                        ? { price: -1 }
                        : order === 'toprated'
                            ? { rating: -1 }
                            : order === 'newest'
                                ? { createdAt: -1 }
                                : { _id: -1 };

        const products = await Product.find({
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
        })
            .sort(sortOrder)
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        const countProducts = await Product.countDocuments({
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
        });
        res.send({
            products,
            countProducts,
            page,
            pages: Math.ceil(countProducts / pageSize),
        });
    })
);

productRouter.get(
    '/products/categories',
    expressAsyncHandler(async (req, res) => {
        const categories = await Product.find().distinct('category');
        res.send(categories);
    })
);

productRouter.get('/products/slug/:slug', async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});
productRouter.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
});







module.exports = productRouter;


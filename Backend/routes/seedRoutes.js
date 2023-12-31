// import express from 'express';
// import Product from '../models/productModel.js';
// import User from '../models/userModel.js';

const express = require('express');
// const User = require('../models/userModel.js');
// const Product = require('../models/productModel.js');
const expressAsyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const data = require('../data.js');
const auth = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/utils');



const seedRouter = express.Router();

seedRouter.post('/seed/',
  auth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // // await Product.remove({});
    const createdProducts = await Product.insertMany(data.products);
    const createdProducts = await Product.insertMany([
    {
      name: 'Admin',
      email: 'admin@admin.com',
      password: bcrypt.hashSync('11111'),
      isAdmin: true,
      phone: 9087654321,
      address: 'Seed address',
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
      phone: 9087654321,
      address: 'Seed address',
    },
    {
      name: 'Durgesh',
      email: 'durgesh@example.com',
      password: bcrypt.hashSync('111'),
      isAdmin: true,
      phone: 9087654321,
      address: 'Nashik,Maharashtra',
    },
  ]);
    // // await User.remove({});
    // const createdUsers = await User.insertMany(data.users);
    // res.send({ createdProducts, createdUsers });
    res.send({ createdProducts });
    // console.log("Products List: ", data.products);
  })
);

seedRouter.post('/seed/users',
  auth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // // await Product.remove({});
    // const createdProducts = await Product.insertMany(data.products);
    // // await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
    // res.send({ createdProducts });
    // console.log("Products List: ", data.products);
  })
);

// Get all tweets details
// seedRouter.get('/', async (req, res) => {
//   const products = await Product.find()                          // select all tweets in database
//   // .populate('tweetedBy', '_id name profilePic username')
//   // .populate('replies', '_id content tweetedBy')
//   // .sort({ createdAt: -1 });


//   res.status(200).json({ products });
// });

// export default seedRouter;



module.exports = seedRouter;


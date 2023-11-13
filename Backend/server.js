const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');   // importing mongoose
const app = express();
// const { MONGO_DB_URL } = require('./config');   // from config.js file
require('dotenv').config();

const PORT = 4000;          // listening on port number 8080

// const DB = "mongodb+srv://durgUser:durgeshmernecomapp@cluster0.rx7bx6w.mongodb.net/ecommerceapp?retryWrites=true&w=majority"
const DB = process.env.DB

// add global variable to get or path
global.__basedir = __dirname;            // __basedir - will hold the path of the base(backend) folder 

// connecting to MONGODB database
mongoose.connect(DB);  // connect to database

// checking connection
mongoose.connection.on('connected', () => {
    console.log('Connection established to MongoDB Atlas');
})
// if error in connection
mongoose.connection.on('error', (error) => {
    console.log('connection error: ' + error);
})

// using cors (middleware)
app.use(cors());

// middleware for formating json responses
app.use(express.json());

// // gateway routes
// app.get("/api/keys/paypal", (req, res) => {
//     res.send(process.env.PAYPAL_CLIENT_ID || "sb");
// });
// app.get("/api/keys/google", (req, res) => {
//     res.send({ key: process.env.GOOGLE_API_KEY || "" });
// });


// Schemas
require('./models/user_model');
// require('./models/tweet_model');
require('./models/product_model');
require('./models/order_model');


// Routes

app.use(require('./routes/user_route'));   // from routes/user_route.js   ( /signup and /login )
// app.use(require('./routes/tweet_route'));   // from routes/tweet_route.js   ( tweet management routes )
app.use(require('./routes/file_route'));   // from routes/file_route.js    ( for uploading files - here images only )
app.use(require('./routes/product_route'));
app.use(require('./routes/order_route'));
app.use(require('./routes/seedRoutes'));


// // gateway routes
// app.get("/api/keys/paypal", (req, res) => {
//     res.send(process.env.PAYPAL_CLIENT_ID || "sb");
// });
// // app.get("/api/keys/google", (req, res) => {
// //     res.send({ key: process.env.GOOGLE_API_KEY || "" });
// // });




app.listen(PORT, (req, res) => {
    console.log(`Server Started on port ${PORT}`);
})






/*


PORT = 8080

Database name - TwitterCloneApp

MONGO_URL - 'mongodb://127.0.0.1:27017/TwitterCloneApp'


*/



































// app.get("/welcome", (req, res) => {
//     res.status(200).json({"msg": "Hey, Brother!"});
// })
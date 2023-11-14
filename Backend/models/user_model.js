
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: true,
        required: true
    },
    phone: {
        type: Number,
        minLength: 10,
    },
    address: {
        type: String,
        default: "unknown"
    }

}, { timestamps: true });

mongoose.model('User', userSchema);


// imported in the server.js 

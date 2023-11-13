const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const expressAsyncHandler = require('express-async-handler');
const bcryptjs = require("bcryptjs");             // for password encryption and decryption (hash and compare)
const jwt = require('jsonwebtoken');        // for token based authentication (jwt token authentication)
const auth = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/utils');
// const { JWT_SECRET_KEY } = require('../config');   // from confi.js file
require('dotenv').config();

const router = express.Router();

// Signup API or route
router.post('/users/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'One or more mandatory fields are empty!' });
    }

    // checking weather user exists in database or not (if exists user already through error) and (if not exists save user in database)
    User.findOne({ email: email })  // here first email is from user_model.js and second email is from req.body above
        .then((userInDB) => {       // if successful
            if (userInDB) {
                return res.status(500).json({ message: 'User with this email or username already exists!', result: { email: email } });
            }
            bcryptjs.hash(password, 16)
                .then((hashedpassword) => {
                    const user = new User({ name, email, password: hashedpassword });
                    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
                    user.save()
                        .then((newUser) => {
                            // res.status(201).json({ result: 'User signed up successfully!' });
                            res.send({
                                _id: user._id,
                                name: user.name,
                                email: user.email,
                                isAdmin: user.isAdmin,
                                token: jwtToken,
                                result: 'User signed up successfully!'
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {                // if error
            console.log(error);
        })


})



// Login API with JWT token authentication
router.post('/users/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'One or more mandatory fields are empty!' });
    }

    // checking weather user exists in database or not
    User.findOne({ email: email })  // find if email already in database
        .then((userInDB) => {       // if successful
            if (!userInDB) {
                return res.status(401).json({ message: 'Invalid Credentials! User not found.' });   // unauthorized access or user (status 401) - if email is not in database
            }
            bcryptjs.compare(password, userInDB.password)      // change hash to "compare" to compare the password with encrypted password 
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, process.env.JWT_SECRET_KEY);  // _id from user in database
                        // const userInfo = { "email": userInDB.email, "name": userInDB.name, "_id": userInDB._id, "username": userInDB.username, "profilePic": userInDB.profilePic, "dob": userInDB.date_of_birth, "location": userInDB.location }   // extra information of the user (don't include password)

                        // return res.status(200).json({ result: { message: 'User login successful!', token: jwtToken, user: userInfo } });

                        res.send({
                            _id: userInDB._id,
                            name: userInDB.name,
                            email: userInDB.email,
                            isAdmin: userInDB.isAdmin,
                            token: jwtToken
                        });

                    }
                    else {
                        return res.status(401).json({ message: 'Invalid credentials! Incorrect password!' });   // if not matched password
                    }
                })
                .catch((error) => {          // if error in comparing password
                    console.log(error);
                })
        })
        .catch((error) => {                // if error
            console.log(error);
        })

})








// Another routes


router.get(
    '/users',
    // isAuth,
    auth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const users = await User.find({});
        res.send(users);
    })
);

router.get(
    '/users/:id',
    // isAuth,
    auth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);



router.put(
    '/users/profile',
    // isAuth,
    auth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;
            if (req.body.password) {
                user.password = bcryptjs.hashSync(req.body.password, 8);
            }
            const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

            const updatedUser = await user.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                phone: updatedUser.phone,
                address: updatedUser.address,
                // token: generateToken(updatedUser),
                token: jwtToken
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    })
);

// router.post(
//     '/users/forget-password',
//     expressAsyncHandler(async (req, res) => {
//         const user = await User.findOne({ email: req.body.email });

//         if (user) {
//             const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//                 expiresIn: '3h',
//             });
//             user.resetToken = token;
//             await user.save();

//             //reset link
//             console.log(`${baseUrl()}/reset-password/${token}`);

//             mailgun()
//                 .messages()
//                 .send(
//                     {
//                         from: 'Amazona <me@mg.yourdomain.com>',
//                         to: `${user.name} <${user.email}>`,
//                         subject: `Reset Password`,
//                         html: ` 
//                <p>Please Click the following link to reset your password:</p> 
//                <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
//                `,
//                     },
//                     (error, body) => {
//                         console.log(error);
//                         console.log(body);
//                     }
//                 );
//             res.send({ message: 'We sent reset password link to your email.' });
//         } else {
//             res.status(404).send({ message: 'User not found' });
//         }
//     })
// );

// router.post(
//     '/users/reset-password',
//     expressAsyncHandler(async (req, res) => {
//         jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
//             if (error) {
//                 res.status(401).send({ message: 'Invalid Token' });
//             } else {
//                 const user = await User.findOne({ resetToken: req.body.token });
//                 if (user) {
//                     if (req.body.password) {
//                         user.password = bcryptjs.hashSync(req.body.password, 8);
//                         await user.save();
//                         res.send({
//                             message: 'Password reseted successfully',
//                         });
//                     }
//                 } else {
//                     res.status(404).send({ message: 'User not found' });
//                 }
//             }
//         });
//     })
// );

router.put(
    '/users/:id',
    // isAuth,
    auth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = Boolean(req.body.isAdmin);
            const updatedUser = await user.save();
            res.send({ message: 'User Updated', user: updatedUser });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

router.delete(
    '/users/:id',
    // isAuth,
    auth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.email === 'admin@example.com') {
                res.status(400).send({ message: 'Can Not Delete Admin User' });
                return;
            }
            await user.deleteOne();
            res.send({ message: 'User Deleted' });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);










module.exports = router;



/*


+ output of login :

1. token - JWT Token (String)

2. User's information (object)


*/

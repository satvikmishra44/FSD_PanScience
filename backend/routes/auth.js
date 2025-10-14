const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// router.post('/login', async (req, res) => {
//     try{
//         const { email, password } = req.body;
//         const user = await User.findOne({email});
//         if(!user){
//             return res.status(404).json({success:false, message: 'User not found'});
//         }

//         const valid = bcrypt.compare(password, user.password);

//         if(!valid){
//             return res.status(401).json({message: 'Invalid password'});
//         }

//         // Bhaiya Pel ke Git Commit Karte Jaao Evaluation Criteria Mein Diya Hai

//     }
// })
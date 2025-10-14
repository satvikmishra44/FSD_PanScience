const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Login Endpoint

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({success:false, message: 'User not found'});
        }

        const valid = bcrypt.compare(password, user.password);

        if(!valid){
            return res.status(401).json({message: 'Invalid password'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWToken, {expiresIn: '7d'});

        res.status(200).json({token: token});
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// Register Endpoint

router.post('/register', async(req, res) => {
    try{
        const {name, email, password, role="user"} = req.body;
        const exists = await User.findOne({email});
        if(exists){
            return res.status(400).json({success: false, message: "Email Already Exists"})
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({name: name, email:email, password: hashed, role: role});
        await user.save();
        res.status(200).json({success: true, message: "User Succesfully Registered"})
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router
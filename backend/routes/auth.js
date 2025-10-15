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

        res.status(200).json({token: token, id: user._id, name: user.name, role: user.role});
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

        if(email==="admin@email.com"){
            role = "admin";
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({name: name, email:email, password: hashed, role: role, tasks: []});
        await user.save();
        res.status(200).json({success: true, message: "User Succesfully Registered"})
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
})

// Getting Self Details
router.get('/me', async(req, res) => {
    try{
        const {id} = req.query;
        const user = await User.findOne({_id: id}).populate({path: 'tasks', model: 'Task'}).select('-password -__v');
        if(!user){
            res.status(404).json({message: 'User Not Found'})
        }
        res.status(200).json(user);
    } catch(err){
        console.error(err);
    }
})

// Get All Tasks Of User
router.get('/tasks', async(req, res) => {
    try {
        const userId = req.query.id; 
        
        const user = await User.findById(userId)
            .populate('tasks') 
            .select('tasks name');
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user.tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router
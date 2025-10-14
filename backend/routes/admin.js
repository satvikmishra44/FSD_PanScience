const express = require("express");
const router = express.Router();
const User = require('../models/User');

router.get('/users', async(req, res) => {
    try{
        const users = await User.find({}, {name: 1});
        if(!users || users.length === 0){
            return res.status(404).json({message: 'No users found'});
        }

        res.status(200).json(users);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;
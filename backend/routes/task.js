const express = require("express");
const router = express.Router();
const User = require('../models/User');

router.get('/dummy', async(req, res) => {
    try{
        res.status(200).send("Dummy Message");
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;
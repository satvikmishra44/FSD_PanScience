const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task')

router.get('/users', async(req, res) => {
    try{
        const users = await User.find({});
        if(!users || users.length === 0){
            return res.status(404).json({message: 'No users found'});
        }

        res.status(200).json(users);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.get('/tasks', async(req, res) => {
    try{
        const tasks = await Task.find({}).populate('assignedTo', 'name');
        if(tasks.length ===0 ){
            return res.status(404).json({message: "No Tasks Found"})
        }

        res.status(200).json(tasks);
    } catch(err){
        console.error("Error Fetching Tasks: ", err);
        res.status(500).send('Server Error')
    }
})

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate({
                path: 'tasks',
                options: { sort: { 'createdAt': -1 }, limit: 3 }
            })
            .select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.put('/users/:id', async (req, res) => {
    const { role } = req.body;
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (role && role.toLowerCase() === 'admin' && user.role.toLowerCase() === 'user') {
            user.role = 'admin';
            await user.save();
            return res.status(200).json({ message: `${user.name} promoted to Admin` });
        } else if (role && role.toLowerCase() === 'user' && user.role.toLowerCase() === 'admin') {
            return res.status(403).json({ message: 'Admin cannot be demoted to User.' });
        } else {
             return res.status(400).json({ message: 'Invalid update operation.' });
        }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
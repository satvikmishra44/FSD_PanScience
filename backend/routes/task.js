const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../uploads/attachments');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        require('fs').mkdirSync(UPLOAD_DIR, { recursive: true }); 
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`); 
    }
});
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed.'), false);
        }
        cb(null, true);
    }
}).array('attachments', 3); 

router.post('/create', upload, async (req, res) => {
    try {
        if (req.files.length === 0) {
            return res.status(400).json({ message: 'At least one PDF file is required.' });
        }
        
        const { title, description, status, priority, dueDate, assignedTo } = req.body;
        
        const attachmentPaths = req.files.map(file => file.path); // Save the full local path

        const newTask = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            attachments: attachmentPaths
        });

        const savedTask = await newTask.save();

        await User.findByIdAndUpdate(
            assignedTo,
            { $push: { tasks: savedTask._id } },
            { new: true, runValidators: true }
        );

        res.status(201).json({ 
            message: 'Task created and assigned successfully',
            task: savedTask
        });

    } catch (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `File upload error: ${err.message}` });
        }
        console.error(err.message);
        res.status(500).json({ message: 'Server Error during task creation.' });
    }
});

// 1. GET Task Details by ID
// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        // Populate assignedTo to get the user's name
        const task = await Task.findById(taskId).populate('assignedTo', 'name'); 

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Format the output to include the assigned user's name directly
        const taskDetails = {
            _id: task._id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            assignedTo: task.assignedTo ? task.assignedTo.name : 'Unassigned',
            attachments: task.attachments || []
        };

        res.status(200).json(taskDetails);
    } catch (error) {
        console.error("Error fetching task details:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2. UPDATE Task by ID
// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const updateData = req.body;

        const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // You might want to re-populate 'assignedTo' if you need the name back immediately
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(400).json({ message: 'Validation failed or server error', error: error.message });
    }
});

// 3. DELETE Task by ID
// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;

        const result = await Task.findByIdAndDelete(taskId);

        if (!result) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
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

module.exports = router;
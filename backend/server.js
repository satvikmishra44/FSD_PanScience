const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const multer = require('multer')
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3000


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connecting To Local DB
const MONGO_URI = 'mongodb://mongodb:27017/myapp'
mongoose.connect(MONGO_URI).then(() => console.log("Connected To Database")).catch((err) => console.error("Error: ", err))

// Handling Directory Creation For Multer PDF
const UPLOAD_DIR = path.join(__dirname, 'uploads/attachments');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        require('fs').mkdirSync(UPLOAD_DIR, {recursive: true});
        cb(null, UPLOAD_DIR);
    }, filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '-')}`);
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype !== 'application/pdf'){
            return cb(new Error('Only PDFs Can Be Uploaded'), false);
        }
        cb(null, true);
    }
});

// Auth Route
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Task Routes
const taskRoutes = require('./routes/task')
app.use('/task', taskRoutes);

// Admin Routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
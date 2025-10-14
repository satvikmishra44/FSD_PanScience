const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000


app.use(cors());
app.use(express.json());

// Connecting To Local DB
const MONGO_URI = 'mongodb://localhost:27017/myapp'
mongoose.connect(MONGO_URI).then(() => console.log("Connected To Database")).catch((err) => console.error("Error: ", err))

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
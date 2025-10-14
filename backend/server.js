const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000


app.use(cors());
app.use(express.json());

// Connecting To Local DB
const MONGO_URI = 'mongodb://localhost:27017/myapp'
mongoose.connect(MONGO_URI).then(() => console.log("Connected To Database")).catch((err) => console.error("Error: ", err))

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
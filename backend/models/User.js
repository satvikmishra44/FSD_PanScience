const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
})

module.exports = mongoose.model('User', User);
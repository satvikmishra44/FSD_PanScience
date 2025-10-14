const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {type: String, required: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    role: { type: String, enum: ['user', 'admin'], default: 'admin' }
})

module.exports = mongoose.model('User', User);
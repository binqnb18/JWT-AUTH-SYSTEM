// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 24,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema); // Tạo mô hình User từ schema
module.exports = mongoose.model('User', userSchema);




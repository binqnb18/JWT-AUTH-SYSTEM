// models/user.js
const mongoose = require('mongoose'); // Sử dụng require để import mongoose

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema); // Tạo mô hình User từ schema

module.exports = User; // Xuất mô hình User

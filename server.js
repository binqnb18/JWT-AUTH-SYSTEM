const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Đảm bảo bạn đã import cors
const authRoutes = require('./routes/authRoutes'); // Import routes

require('dotenv').config(); // Tải biến môi trường từ file .env

const app = express();
const PORT = process.env.PORT || 4000;

// Cấu hình middleware cho CORS
app.use(cors({
    origin: 'http://localhost:5173', // Cho phép frontend từ địa chỉ này
    credentials: true, // Cho phép gửi cookie
}));

app.use(express.json()); // Middleware để parse JSON
app.use(cookieParser()); // Middleware để parse cookies

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err.message));

app.use('/api/auth', authRoutes); // Sử dụng  router cho các route xác thực

// Các routes khác
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

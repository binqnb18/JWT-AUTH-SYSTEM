const express = require('express');
const { register, login, logout, refreshToken } = require('../controller/authController'); // Import đúng tên hàm
const { authenticateToken } = require('../middlewares/authMiddleware'); // Import middleware xác thực
const router = express.Router();

// Định nghĩa route POST cho đăng ký
router.post('/register', register);

// Route đăng nhập (login)
router.post('/login', login);

// Route đăng xuất (logout)
router.post('/logout', logout);

// Thêm route refresh token
router.post('/refresh-token', refreshToken);

// Route bảo vệ yêu cầu xác thực token
router.get('/user', authenticateToken, (req, res) => {
    res.json({ message: 'Protected data', user: req.user });
});

module.exports = router;

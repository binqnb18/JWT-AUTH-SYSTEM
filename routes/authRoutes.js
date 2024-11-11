const express = require('express');
const { login, logout, refreshToken } = require('../controller/authController'); // Chỉ import một lần
const { authenticateToken } = require('../middlewares/authMiddleware'); // Import middleware xác thực
const router = express.Router();

// Route đăng nhập (login)
router.post('/login', login);

// Route đăng xuất (logout)
router.post('/logout', logout);  // Xử lý logout

 // Thêm route refresh token
router.post('/refresh-token', refreshToken); 

// Route bảo vệ yêu cầu xác thực token
router.get('/user', authenticateToken, (req, res) => {
    res.json({ message: 'Protected data', user: req.user });
});

module.exports = router;

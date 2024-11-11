// authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware để xác thực Access Token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Lấy token từ header

    if (!token) {
        return res.status(401).json({ message: 'Access Token is required' }); // Token không có, trả về lỗi 401
    }

    // Kiểm tra token hợp lệ bằng JWT
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' }); // Token không hợp lệ hoặc hết hạn
        }

        req.user = user; // Lưu thông tin người dùng vào req
        next(); // Tiếp tục tới các route tiếp theo
    });
};

module.exports = { authenticateToken };

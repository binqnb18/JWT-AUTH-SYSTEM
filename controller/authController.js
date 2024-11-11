const User = require("../models/userModel"); // Import model người dùng
const bcrypt = require("bcryptjs"); // Để mã hóa mật khẩu
const jwt = require("jsonwebtoken"); // Để tạo token

// Hàm tạo Access Token (hết hạn trong 30 giây)
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); // Access Token hết hạn sau 30 giây
} 

// Hàm tạo Refresh Token
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); // Refresh Token không có thời gian hết hạn
}

// API Login
exports.login = async (req, res) => {
  const { email, password } = req.body; // Nhận email và password từ body

  try {
    // Kiểm tra người dùng có tồn tại trong hệ thống không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Tạo Access Token và Refresh Token
    const accessToken = generateAccessToken({ id: user._id, name: user.name });
    const refreshToken = generateRefreshToken({ id: user._id, name: user.name });

    // Lưu Refresh Token vào HttpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    // Trả về Access Token và trạng thái thành công
    return res.json({ success: true, accessToken });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};


// API Refresh Token
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Lấy Refresh Token từ cookie

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh Token is required" });
  }

  // Kiểm tra và giải mã Refresh Token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    // Tạo Access Token mới khi Refresh Token hợp lệ
    const newAccessToken = generateAccessToken({ id: user.id, name: user.name });

    // Trả về Access Token mới
    return res.json({ accessToken: newAccessToken });
  });
};

// API Logout để xóa Refresh Token khỏi Cookie
exports.logout = (req, res) => {
  try {
    // Xóa Refresh Token khỏi HttpOnly cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Sử dụng cookie bảo mật nếu môi trường là production
      sameSite: "strict", // Ngăn chặn việc gửi cookie từ domain khác
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Error logging out" });
  }
};

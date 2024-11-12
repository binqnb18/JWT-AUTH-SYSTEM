const User = require("../models/userModel"); // Import model User để làm việc với MongoDB
const bcrypt = require("bcryptjs"); // Import bcrypt để mã hóa mật khẩu
const jwt = require("jsonwebtoken"); // Import jsonwebtoken để tạo Access Token và Refresh Token

// Hàm tạo Access Token (hết hạn sau 15 phút)
function generateAccessToken(user) {
  // Tạo Access Token với thời gian hết hạn là 15 phút
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// Hàm tạo Refresh Token (không có thời gian hết hạn)
function generateRefreshToken(user) {
  // Tạo Refresh Token mà không hết hạn, chỉ được làm mới khi cần Access Token mới
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

// API Đăng ký người dùng mới
exports.register = async (req, res) => {
  const { username, email, password } = req.body; // Nhận username, email và password từ request body

  // Kiểm tra xem tất cả các trường bắt buộc có tồn tại không
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Kiểm tra xem username hoặc email có trùng lặp trong database không
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      // Nếu username hoặc email đã tồn tại, trả về lỗi 409 (Conflict)
      return res.status(409).json({ success: false, message: "Username or email already taken" });
    }

    // Mã hóa mật khẩu trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới với username, email, và mật khẩu đã mã hóa
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Lưu người dùng mới vào MongoDB
    await newUser.save();

    // Tạo Access Token và Refresh Token cho người dùng mới
    const accessToken = generateAccessToken({ id: newUser._id, username: newUser.username });
    const refreshToken = generateRefreshToken({ id: newUser._id, username: newUser.username });

    // Lưu Refresh Token vào HttpOnly Cookie để đảm bảo bảo mật
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Cookie này chỉ có thể được truy cập từ server
      secure: process.env.NODE_ENV === 'production', // Chỉ cho phép cookie qua HTTPS nếu ở môi trường production
      sameSite: 'strict', // Ngăn ngừa việc gửi cookie từ domain khác
      maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie tồn tại trong 7 ngày
    });

    // Trả về Access Token và thông báo thành công
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ success: false, message: "Registration failed. Please try again." });
  }
};

// API Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body; // Lấy email và password từ request body

  try {
    // Tìm người dùng dựa trên email
    const user = await User.findOne({ email });
    if (!user) {
      // Nếu không tìm thấy người dùng, trả về lỗi 400
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Nếu mật khẩu không khớp, trả về lỗi 400
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Tạo Access Token và Refresh Token cho người dùng hợp lệ
    const accessToken = generateAccessToken({ id: user._id, username: user.username });
    const refreshToken = generateRefreshToken({ id: user._id, username: user.username });

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

// API Refresh Token - Làm mới Access Token bằng Refresh Token
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Lấy Refresh Token từ cookie HttpOnly

  if (!refreshToken) {
    // Nếu không có Refresh Token, trả về lỗi 403
    return res.status(403).json({ message: "Refresh Token is required" });
  }

  // Giải mã Refresh Token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      // Nếu Refresh Token không hợp lệ, trả về lỗi 403
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    // Tạo Access Token mới từ Refresh Token hợp lệ
    const newAccessToken = generateAccessToken({ id: user.id, username: user.username });

    // Trả về Access Token mới
    return res.json({ accessToken: newAccessToken });
  });
};

// API Đăng xuất để xóa Refresh Token khỏi Cookie
exports.logout = (req, res) => {
  try {
    // Xóa Refresh Token khỏi HttpOnly cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
    });

    // Trả về trạng thái đăng xuất thành công
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Error logging out" });
  }
};

import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/userService";  // Import logoutUser từ userService.js

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      console.log(response);  // Xem kết quả từ API

      // Sau khi logout thành công, xóa Access Token khỏi localStorage
      localStorage.removeItem("accessToken");

      // Điều hướng người dùng về trang login sau khi logout thành công
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold">JWT AUTH SYSTEM</h1>
        </Link>
        <ul className="flex gap-4">
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/about">
            <li>About</li>
          </Link>
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}

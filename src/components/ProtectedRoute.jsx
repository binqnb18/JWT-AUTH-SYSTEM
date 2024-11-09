// // src/components/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//     const isLoggedIn = !!localStorage.getItem('accessToken'); // Kiểm tra nếu người dùng đã đăng nhập

//     return isLoggedIn ? children : <Navigate to="/" />; // Nếu đã đăng nhập, hiển thị children; nếu không, điều hướng về trang login
// };

// export default ProtectedRoute;

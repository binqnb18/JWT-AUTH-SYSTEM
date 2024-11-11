  import React from 'react';
  import { Navigate } from 'react-router-dom';

  // Hàm kiểm tra nếu Access Token có hợp lệ hay không
  const ProtectedRoute = ({ element: Component, ...rest }) => {
    const accessToken = localStorage.getItem('accessToken'); // Kiểm tra nếu có token trong localStorage

    return accessToken ? Component : <Navigate to="/login" />; // Nếu có Access Token, render Component, ngược lại chuyển hướng về login
  }

  export default ProtectedRoute;



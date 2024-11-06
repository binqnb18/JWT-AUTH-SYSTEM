// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login'; // Import Login component
import UserProfile from './pages/UserProfile'; // Import UserProfile component
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute component
import SignUp from './pages/Singup'; // Đảm bảo bạn nhập đúng tên file

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} /> {/* Trang đăng nhập */}
                <Route path="/signup" element={<SignUp />} /> {/* Trang đăng ký */}
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <UserProfile /> {/* Trang người dùng được bảo vệ */}
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;

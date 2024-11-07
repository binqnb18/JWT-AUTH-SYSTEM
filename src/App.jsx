import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login'; // Import Login component
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute component
import SignUp from './pages/Singup'; // Sửa tên file từ SignUp thành SignUp
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} /> {/* Trang đăng nhập */}
                <Route path="/sign-up" element={<SignUp />} /> {/* Trang đăng ký */}
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <Dashboard /> {/* Trang người dùng được bảo vệ */}
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;

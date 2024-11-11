import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

export default function App() {
  return (
    <BrowserRouter>
      {/* Header */}
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        {/* Bảo vệ route Dashboard */}
        <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

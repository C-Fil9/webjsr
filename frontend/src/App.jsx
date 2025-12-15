import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/register';
import ProFile from './pages/public/ProFile';
import Stats from './pages/admin/Stats';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { UserContextProvider, UserContext } from '../context/userContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBooks from './pages/admin/ManageBooks';
import ManageCategories from './pages/admin/ManageCategories';
import BookDetail from './pages/book/BookDetail';
import ReadBook from './pages/book/ReadBook';
import Layout from './components/Layout/Layout';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';


axios.defaults.baseURL = 'http://localhost:8000/api';
axios.defaults.withCredentials = true;

function AppContent() {
  const { user } = useContext(UserContext);

  return (
    <>
      <Layout userRole={user?.role}>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProFile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/stats" element={<Stats />} />
          <Route path="/admin/ManageUsers" element={<ManageUsers />} />
          <Route path="/admin/ManageBooks" element={<ManageBooks />} />
          <Route path="/admin/ManageCategories" element={<ManageCategories />} />
          {/* user routes */}
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="book/read/:id" element={<ReadBook />} />
          {/* Catch-all route */}
        </Routes>
      </Layout>
    </>
  );
}

function App() {
  return (
    <UserContextProvider>
      <AppContent />
    </UserContextProvider>
  );
}

export default App;

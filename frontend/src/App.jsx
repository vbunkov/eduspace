import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AuthorProfilePage from './pages/AuthorProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import MyLearningPage from './pages/MyLearningPage';
import ProfilePage from './pages/ProfilePage';
import AuthorStudioPage from './pages/AuthorStudioPage';
import ModerationPage from './pages/ModerationPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* 6 публичных маршрутов */}
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/authors/:id" element={<AuthorProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 5 защищенных маршрутов */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/my-learning" element={<ProtectedRoute><MyLearningPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route
                path="/author/courses"
                element={<ProtectedRoute allowedRoles={['author', 'admin']}><AuthorStudioPage /></ProtectedRoute>}
              />
              <Route
                path="/admin/moderation"
                element={<ProtectedRoute allowedRoles={['admin']}><ModerationPage /></ProtectedRoute>}
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

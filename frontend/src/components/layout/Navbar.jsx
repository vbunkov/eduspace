import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ShoppingCart, User, LogOut, ShieldAlert, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <BookOpen className="w-6 h-6" />
            <span>EduSpace</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/catalog" className="hover:text-indigo-600">Каталог курсов</Link>
            {user && <Link to="/my-learning" className="hover:text-indigo-600">Мое обучение</Link>}
            {user && (user.role === 'author' || user.role === 'admin') && (
              <Link to="/author/courses" className="hover:text-indigo-600 flex items-center gap-1">
                <PlusCircle className="w-4 h-4" /> Студия автора
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin/moderation" className="text-rose-600 hover:text-rose-700 flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Модерация
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-indigo-600">
                <User className="w-4 h-4" />
                <span>{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600" title="Выйти">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-indigo-600">
                Войти
              </Link>
              <Link to="/register" className="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
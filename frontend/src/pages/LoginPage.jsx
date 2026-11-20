import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/catalog');
    } catch {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 mt-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Вход в EduSpace</h1>
      {error && <p className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Логин" required value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input label="Пароль" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full py-2.5">Войти</Button>
      </form>
      <p className="text-sm text-center text-slate-500 mt-4">
        Нет аккаунта? <Link to="/register" className="text-indigo-600 hover:underline">Зарегистрироваться</Link>
      </p>
    </div>
  );
}
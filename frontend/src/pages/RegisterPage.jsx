import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'student', bio: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/catalog');
    } catch (err) {
      setError('Ошибка регистрации. Проверьте корректность данных или уникальность логина/email.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 mt-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">Регистрация</h1>
      {error && <p className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Логин" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Пароль (мин. 6 символов)" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div>
          <label className="text-sm font-medium text-slate-700">Роль на платформе</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="student">Студент (покупка и прохождение курсов)</option>
            <option value="author">Автор (создание и продажа курсов)</option>
          </select>
        </div>
        <Button type="submit" className="w-full py-2.5">Создать аккаунт</Button>
      </form>
      <p className="text-sm text-center text-slate-500 mt-4">
        Уже есть аккаунт? <Link to="/login" className="text-indigo-600 hover:underline">Войти</Link>
      </p>
    </div>
  );
}
import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function ProfilePage() {
  const { user, fetchProfile } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await api.patch('/users/profile/', { email, bio });
    await fetchProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Настройки профиля</h1>
        <Badge>{user?.role}</Badge>
      </div>
      {saved && <p className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm">Профиль успешно обновлен!</p>}
      <form onSubmit={handleSave} className="space-y-4">
        <Input label="Логин" value={user?.username} disabled className="bg-slate-100" />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div>
          <label className="text-sm font-medium text-slate-700">О себе (отображается на странице автора)</label>
          <textarea
            rows="4" value={bio} onChange={(e) => setBio(e.target.value)}
            className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg text-sm"
          />
        </div>
        <Button type="submit">Сохранить изменения</Button>
      </form>
    </div>
  );
}
import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../ui/Button';

export default function PurchasedCourseCard({ item }) {
  const handleDownload = async () => {
    try {
      const res = await api.get(`/courses/${item.course}/materials/`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `course_${item.course}_materials.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(err.response?.status === 404 ? 'Автор ещё не загрузил архив материалов.' : 'Ошибка скачивания файла.');
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between gap-4">
      <div>
        <Link to={`/courses/${item.course}`} className="text-lg font-bold text-slate-900 hover:text-indigo-600">
          {item.course_title}
        </Link>
        <p className="text-xs text-slate-500 mt-1">Куплено за {Number(item.price_at_purchase).toLocaleString()} ₽</p>
      </div>
      <Button onClick={handleDownload} variant="outline" className="w-full">
        <Download className="w-4 h-4" /> Скачать материалы
      </Button>
    </div>
  );
}
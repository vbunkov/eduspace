import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import CourseCard from '../components/courses/CourseCard';
import Spinner from '../components/ui/Spinner';

export default function AuthorProfilePage() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/authors/${id}/`)
      .then((res) => setAuthor(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!author) return <p>Автор не найден.</p>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">{author.username}</h1>
        <p className="text-sm text-slate-500 mt-1">На платформе с {new Date(author.date_joined).toLocaleDateString('ru-RU')}</p>
        <p className="text-slate-700 mt-4">{author.bio || 'Автор пока не добавил информацию о себе.'}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Курсы автора ({author.courses?.length || 0})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {author.courses?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import api from '../api/axios';
import ModerationRow from '../components/account/ModerationRow';

export default function ModerationPage() {
  const [courses, setCourses] = useState([]);

  const loadCourses = () => {
    api.get('/courses/').then((res) => setCourses(res.data.results || res.data));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleToggle = async (type, id) => {
    await api.patch(`/moderation/${type}/${id}/`);
    loadCourses();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Панель модерации платформы</h1>
      <div className="space-y-4">
        {courses.map((course) => (
          <ModerationRow key={course.id} item={course} type="course" onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AuthorCourseRow from '../components/account/AuthorCourseRow';
import CourseFormModal from '../components/account/CourseFormModal';
import Button from '../components/ui/Button';

export default function AuthorStudioPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const loadData = () => {
    api.get('/courses/', { params: { author: user.id } }).then((res) => {
      setCourses(res.data.results || res.data);
    });
  };

  useEffect(() => {
    loadData();
    api.get('/categories/').then((res) => setCategories(res.data));
  }, []);

  const handleSave = async (formData, courseId) => {
    if (courseId) {
      await api.patch(`/courses/${courseId}/`, formData);
    } else {
      await api.post('/courses/', formData);
    }
    setModalOpen(false);
    setEditingCourse(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить этот курс?')) {
      await api.delete(`/courses/${id}/`);
      loadData();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Студия автора</h1>
        <Button onClick={() => { setEditingCourse(null); setModalOpen(true); }}>
          <Plus className="w-4 h-4" /> Создать курс
        </Button>
      </div>

      <div className="space-y-4">
        {courses.length ? (
          courses.map((course) => (
            <AuthorCourseRow
              key={course.id}
              course={course}
              onEdit={(c) => { setEditingCourse(c); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-slate-500">У вас пока нет созданных курсов.</p>
        )}
      </div>

      <CourseFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        initialData={editingCourse}
        onSave={handleSave}
      />
    </div>
  );
}
import { useEffect, useState } from 'react';
import api from '../api/axios';
import CourseCard from '../components/courses/CourseCard';
import CourseFilters from '../components/courses/CourseFilters';
import Spinner from '../components/ui/Spinner';

export default function CatalogPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories/').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { ordering };
    if (search) params.search = search;
    if (category) params.category = category;

    api.get('/courses/', { params })
      .then((res) => setCourses(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, [search, category, ordering]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Каталог курсов</h1>
      <CourseFilters
        categories={categories}
        search={search} setSearch={setSearch}
        category={category} setCategory={setCategory}
        ordering={ordering} setOrdering={setOrdering}
      />
      {loading ? (
        <Spinner />
      ) : courses.length ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 py-12">Курсы по вашему запросу не найдены.</p>
      )}
    </div>
  );
}
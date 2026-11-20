import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck, Award } from 'lucide-react';
import api from '../api/axios';
import CourseCard from '../components/courses/CourseCard';
import Button from '../components/ui/Button';

export default function HomePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get('/courses/').then((res) => {
      const list = res.data.results || res.data;
      setCourses(list.slice(0, 3));
    });
  }, []);

  return (
    <div className="space-y-16">
      <section className="bg-indigo-600 text-white rounded-2xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-5">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Осваивайте востребованные профессии на EduSpace
          </h1>
          <p className="text-indigo-100 text-lg">
            Маркетплейс авторских онлайн-курсов с доступом к учебным материалам, честными отзывами студентов и удобным личным кабинетом.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/catalog"
              className="px-6 py-3 rounded-lg font-semibold bg-white text-indigo-700 hover:bg-indigo-50 transition inline-flex items-center gap-2 text-base"
            >
              Перейти в каталог <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/register">
              <Button variant="outline" className="border-indigo-300 text-white hover:bg-indigo-500 px-6 py-3 text-base">
                Стать автором
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex gap-4">
          <BookOpen className="w-8 h-8 text-indigo-600 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900">Практические программы</h3>
            <p className="text-sm text-slate-500 mt-1">Актуальные курсы от практикующих специалистов с готовыми архивами материалов.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex gap-4">
          <ShieldCheck className="w-8 h-8 text-indigo-600 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900">Защищенный доступ</h3>
            <p className="text-sm text-slate-500 mt-1">Материалы доступны сразу после оплаты в вашем личном кабинете студента.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex gap-4">
          <Award className="w-8 h-8 text-indigo-600 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900">Честный рейтинг</h3>
            <p className="text-sm text-slate-500 mt-1">Отзывы могут оставлять только реальные покупатели, прошедшие обучение.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Популярные курсы</h2>
          <Link to="/catalog" className="text-indigo-600 font-medium hover:underline">Все курсы →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
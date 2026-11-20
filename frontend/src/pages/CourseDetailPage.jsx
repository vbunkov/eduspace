import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import StarRating from '../components/courses/StarRating';
import ReviewList from '../components/courses/ReviewList';
import ReviewForm from '../components/courses/ReviewForm';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { cart, addToCart } = useCart();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}/`),
      api.get(`/courses/${id}/reviews/`)
    ]).then(([courseRes, revRes]) => {
      setCourse(courseRes.data);
      setReviews(revRes.data.results || revRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!course) return <p>Курс не найден.</p>;

  const inCart = cart.some((item) => item.id === course.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-3">
          <Badge>{course.category_name || 'Курс'}</Badge>
          <StarRating rating={course.avg_rating} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
        <p className="text-sm text-slate-500">
          Автор курса: <Link to={`/authors/${course.author}`} className="text-indigo-600 font-medium hover:underline">{course.author_name}</Link>
        </p>
        <p className="text-slate-700 leading-relaxed">{course.description}</p>

        <div className="pt-4 border-t flex items-center justify-between">
          <span className="text-3xl font-extrabold text-slate-900">{Number(course.price).toLocaleString()} ₽</span>
          <Button onClick={() => addToCart(course)} disabled={inCart}>
            {inCart ? <><Check className="w-5 h-5" /> В корзине</> : <><ShoppingCart className="w-5 h-5" /> Добавить в корзину</>}
          </Button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Программа обучения</h2>
        <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed">{course.syllabus}</pre>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Отзывы студентов ({reviews.length})</h2>
        <ReviewList reviews={reviews} />
        {user && (
          <ReviewForm
            courseId={id}
            onReviewAdded={(newRev) => setReviews([newRev, ...reviews])}
          />
        )}
      </div>
    </div>
  );
}
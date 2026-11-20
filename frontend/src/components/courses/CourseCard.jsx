import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import Badge from '../ui/Badge';
import StarRating from './StarRating';
import { useCart } from '../../context/CartContext';

export default function CourseCard({ course }) {
  const { cart, addToCart } = useCart();
  const inCart = cart.some((item) => item.id === course.id);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition">
      <div>
        <div className="flex justify-between items-start gap-2 mb-3">
          <Badge>{course.category_name || 'Без категории'}</Badge>
          <StarRating rating={course.avg_rating} />
        </div>
        <Link to={`/courses/${course.id}`} className="text-lg font-bold text-slate-900 hover:text-indigo-600 line-clamp-2">
          {course.title}
        </Link>
        <p className="text-sm text-slate-500 mt-1">
          Автор: <Link to={`/authors/${course.author}`} className="text-indigo-600 hover:underline">{course.author_name}</Link>
        </p>
        <p className="text-sm text-slate-600 mt-3 line-clamp-3">{course.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xl font-bold text-slate-900">{Number(course.price).toLocaleString()} ₽</span>
        <button
          onClick={() => addToCart(course)}
          disabled={inCart}
          className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
            inCart
              ? 'bg-emerald-100 text-emerald-700 cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {inCart ? <><Check className="w-4 h-4" /> В корзине</> : <><ShoppingCart className="w-4 h-4" /> В корзину</>}
        </button>
      </div>
    </div>
  );
}
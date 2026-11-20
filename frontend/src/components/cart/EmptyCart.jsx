import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from '../ui/Button';

export default function EmptyCart() {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
      <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-bold text-slate-800">Ваша корзина пуста</h3>
      <p className="text-sm text-slate-500 mt-1 mb-6">Выберите интересующие курсы в каталоге</p>
      <Link to="/catalog">
        <Button>Перейти в каталог</Button>
      </Link>
    </div>
  );
}
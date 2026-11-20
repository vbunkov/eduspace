import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      await api.post('/orders/', { course_ids: cart.map((c) => c.id) });
      clearCart();
      navigate('/my-learning');
    } catch {
      alert('Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Корзина</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} onRemove={removeFromCart} />
          ))}
        </div>
        <CartSummary count={cart.length} totalPrice={totalPrice} onCheckout={handleCheckout} loading={loading} />
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import api from '../api/axios';
import PurchasedCourseCard from '../components/account/PurchasedCourseCard';
import OrderHistoryRow from '../components/account/OrderHistoryRow';
import Spinner from '../components/ui/Spinner';

export default function MyLearningPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my/')
      .then((res) => setOrders(res.data.results || res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const purchasedItems = orders.flatMap((order) => order.items);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Мои купленные курсы</h1>
        {purchasedItems.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {purchasedItems.map((item) => (
              <PurchasedCourseCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500">Вы еще не приобрели ни одного курса.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">История заказов</h2>
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderHistoryRow key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
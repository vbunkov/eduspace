import Badge from '../ui/Badge';

export default function OrderHistoryRow({ order }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Заказ #{order.id}</span>
          <Badge color="green">Оплачен</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {new Date(order.created_at).toLocaleDateString('ru-RU')} • {order.items.map((i) => i.course_title).join(', ')}
        </p>
      </div>
      <span className="font-bold text-slate-900">{Number(order.total_price).toLocaleString()} ₽</span>
    </div>
  );
}
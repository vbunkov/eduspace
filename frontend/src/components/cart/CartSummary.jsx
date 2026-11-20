import Button from '../ui/Button';

export default function CartSummary({ count, totalPrice, onCheckout, loading }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 h-fit space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Итого</h3>
      <div className="flex justify-between text-sm text-slate-600">
        <span>Курсов в корзине:</span>
        <span>{count} шт.</span>
      </div>
      <div className="border-t pt-4 flex justify-between text-xl font-bold text-slate-900">
        <span>К оплате:</span>
        <span>{totalPrice.toLocaleString()} ₽</span>
      </div>
      <Button onClick={onCheckout} disabled={loading || count === 0} className="w-full py-3">
        {loading ? 'Оформление...' : 'Оплатить и получить доступ'}
      </Button>
    </div>
  );
}
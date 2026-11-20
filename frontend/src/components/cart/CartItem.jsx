import { Trash2 } from 'lucide-react';

export default function CartItem({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
      <div>
        <h4 className="font-bold text-slate-900">{item.title}</h4>
        <p className="text-xs text-slate-500">Автор: {item.author_name}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-slate-900">{Number(item.price).toLocaleString()} ₽</span>
        <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-rose-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
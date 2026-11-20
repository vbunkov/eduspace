import { Star } from 'lucide-react';

export default function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1 text-amber-500">
      <Star className="w-4 h-4 fill-amber-400" />
      <span className="text-sm font-semibold text-slate-700">{Number(rating).toFixed(1)}</span>
    </div>
  );
}
import StarRating from './StarRating';

export default function ReviewList({ reviews }) {
  if (!reviews.length) {
    return <p className="text-slate-500 text-sm">Пока нет отзывов. Станьте первым!</p>;
  }
  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div key={rev.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-slate-800">{rev.user_name}</span>
            <StarRating rating={rev.rating} />
          </div>
          <p className="text-sm text-slate-600">{rev.text}</p>
        </div>
      ))}
    </div>
  );
}
import { useState } from 'react';
import api from '../../api/axios';
import Button from '../ui/Button';

export default function ReviewForm({ courseId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post(`/courses/${courseId}/reviews/`, { rating, text });
      setText('');
      onReviewAdded(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при отправке отзыва');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-slate-200 mt-4 space-y-3">
      <h4 className="font-semibold text-slate-800">Оставить отзыв о курсе</h4>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <div>
        <label className="text-sm text-slate-600 mr-2">Оценка:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded px-2 py-1">
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={num}>{num} ★</option>
          ))}
        </select>
      </div>
      <textarea
        required
        rows="3"
        placeholder="Поделитесь впечатлениями о курсе..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Отправка...' : 'Опубликовать отзыв'}
      </Button>
    </form>
  );
}
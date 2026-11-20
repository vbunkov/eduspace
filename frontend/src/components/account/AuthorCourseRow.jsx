import { Edit, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';

export default function AuthorCourseRow({ course, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-900">{course.title}</h4>
          <Badge color={course.is_active ? 'green' : 'rose'}>
            {course.is_active ? 'Опубликован' : 'Скрыт'}
          </Badge>
        </div>
        <p className="text-sm text-slate-500 mt-1">{Number(course.price).toLocaleString()} ₽ • {course.category_name}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(course)} className="p-2 text-slate-600 hover:text-indigo-600" title="Редактировать">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(course.id)} className="p-2 text-slate-600 hover:text-rose-600" title="Удалить">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
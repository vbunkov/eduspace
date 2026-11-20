import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ModerationRow({ item, type, onToggle }) {
  const isVisible = type === 'course' ? item.is_active : !item.is_hidden;
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">{type === 'course' ? item.title : `Отзыв от ${item.user_name}`}</span>
          <Badge color={isVisible ? 'green' : 'rose'}>{isVisible ? 'Активен' : 'Скрыт модератором'}</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {type === 'course' ? `Автор: ${item.author_name}` : item.text}
        </p>
      </div>
      <Button variant={isVisible ? 'danger' : 'secondary'} onClick={() => onToggle(type, item.id)}>
        {isVisible ? 'Скрыть' : 'Восстановить'}
      </Button>
    </div>
  );
}
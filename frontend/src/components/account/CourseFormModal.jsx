import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function CourseFormModal({ isOpen, onClose, categories, initialData, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setSyllabus(initialData.syllabus);
      setPrice(initialData.price);
      setCategory(initialData.category || '');
    } else {
      setTitle('');
      setDescription('');
      setSyllabus('');
      setPrice('');
      setCategory(categories[0]?.id || '');
    }
    setFile(null);
  }, [initialData, isOpen, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('syllabus', syllabus);
    formData.append('price', price);
    if (category) formData.append('category', category);
    if (file) formData.append('material_file', file);
    onSave(formData, initialData?.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Редактировать курс' : 'Создать новый курс'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Название курса" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <div>
          <label className="text-sm font-medium text-slate-700">Категория</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <Input label="Цена (₽)" type="number" required value={price} onChange={(e) => setPrice(e.target.value)} />
        <div>
          <label className="text-sm font-medium text-slate-700">Описание</label>
          <textarea
            required rows="2" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Программа курса (модули)</label>
          <textarea
            required rows="3" value={syllabus} onChange={(e) => setSyllabus(e.target.value)}
            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Архив материалов (.zip / .pdf)</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm mt-1" />
        </div>
        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Отмена</Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Modal>
  );
}
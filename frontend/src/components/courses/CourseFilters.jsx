import { Search } from 'lucide-react';

export default function CourseFilters({ categories, search, setSearch, category, setCategory, ordering, setOrdering }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Поиск по названию или описанию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Все категории</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select
        value={ordering}
        onChange={(e) => setOrdering(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="-created_at">Сначала новые</option>
        <option value="price">Сначала дешевле</option>
        <option value="-price">Сначала дороже</option>
      </select>
    </div>
  );
}
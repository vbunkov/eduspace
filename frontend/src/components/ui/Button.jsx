export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-100',
  };
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition duration-150 inline-flex items-center justify-center gap-2 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
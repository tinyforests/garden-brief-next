
export default function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/90 px-4 py-2 text-sm font-medium text-black transition hover:bg-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

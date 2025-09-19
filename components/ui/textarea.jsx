
export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border border-black/10 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-black/20 ${className}`}
      {...props}
    />
  );
}

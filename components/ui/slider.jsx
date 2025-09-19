
export function Slider({ value = [5], min = 0, max = 10, step = 1, onValueChange }) {
  const v = value[0] ?? 0;
  return (
    <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => onValueChange([Number(e.target.value)])} className="w-full" />
  );
}

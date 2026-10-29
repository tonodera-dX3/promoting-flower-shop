export default function CharCounter({ count, max }: { count: number; max: number }) {
  return (
    <span className="text-base text-secondary" aria-live="polite">
      {count}/{max}
    </span>
  );
}

// スライドショーの現在位置を示すドット
export default function Dot({ active }: { active: boolean }) {
  return (
    <span
      className={`block size-2.5 rounded-full transition-colors ${active ? "bg-primary" : "bg-secondary/30"}`}
    />
  );
}

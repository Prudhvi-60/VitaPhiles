export function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-3">
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-[#d6b77a]">{eyebrow}</div>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-[#f5efe7]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

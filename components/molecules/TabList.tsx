type Tab = { key: string; label: string };

type Props = {
  tabs: Tab[];
  selected: string;
  onSelect: (key: string) => void;
  idPrefix: string;
};

export default function TabList({ tabs, selected, onSelect, idPrefix }: Props) {
  return (
    <div role="tablist" className="grid grid-cols-3 gap-1 rounded-2xl bg-card p-1">
      {tabs.map((tab) => {
        const active = tab.key === selected;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.key}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${tab.key}`}
            onClick={() => onSelect(tab.key)}
            className={`min-h-11 rounded-xl text-base font-bold transition-colors ${active ? "bg-primary text-background" : "text-secondary"}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

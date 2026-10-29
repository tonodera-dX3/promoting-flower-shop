"use client";

import { useState, type ReactNode } from "react";
import TabList from "@/components/molecules/TabList";

type Tab = { key: string; label: string; content: ReactNode };

// 最初のタブを初期選択する。切り替えても入力中の状態が消えないよう、全パネルを残して hidden にする
export default function TabView({ tabs, idPrefix }: { tabs: Tab[]; idPrefix: string }) {
  const [selected, setSelected] = useState(tabs[0].key);

  return (
    <div className="flex flex-col gap-5">
      <TabList tabs={tabs} selected={selected} onSelect={setSelected} idPrefix={idPrefix} />
      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${idPrefix}-panel-${tab.key}`}
          aria-labelledby={`${idPrefix}-tab-${tab.key}`}
          hidden={tab.key !== selected}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

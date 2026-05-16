"use client";

import { ClipboardList, Copy, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, Chip } from "./Card";
import type { ShoppingCategory, ShoppingList } from "@/lib/types";

const CATEGORY_LABEL: Record<ShoppingCategory, string> = {
  pâte: "Pâte",
  topping: "Garnitures",
  glace: "Glaces & cônes",
  boisson: "Boissons",
  conso: "Consommables"
};

const CATEGORY_ORDER: ShoppingCategory[] = ["pâte", "topping", "glace", "boisson", "conso"];

export function ShoppingListCard({ list }: { list: ShoppingList }) {
  const [copied, setCopied] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<ShoppingCategory, ShoppingList["items"]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const item of list.items) {
      map.get(item.category)?.push(item);
    }
    return Array.from(map.entries()).filter(([, items]) => items.length > 0);
  }, [list.items]);

  const handleCopy = async () => {
    const lines = CATEGORY_ORDER.flatMap((cat) => {
      const items = list.items.filter((i) => i.category === cat);
      if (items.length === 0) return [];
      return [
        `\n${CATEGORY_LABEL[cat].toUpperCase()}`,
        ...items.map((i) => `  • ${i.label} — ${i.qty}${i.note ? ` (${i.note})` : ""}`)
      ];
    });
    const text = [`Liste de courses — ${list.summary}`, ...lines].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  return (
    <Card title="Liste de courses" subtitle="Calibrée sur la recette" icon={ClipboardList} tone="peach">
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <Chip tone="accent">Pâte {Math.round(list.batterRatio * 100)} %</Chip>
        <Chip>Serviettes ×{list.napkinMultiplier}</Chip>
        <Chip tone={list.drinkTier === "canicule" ? "danger" : list.drinkTier === "renforcé" ? "warn" : "ok"}>
          Boissons {list.drinkTier}
        </Chip>
        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto inline-flex items-center gap-1 rounded-full border border-seine-border bg-seine-bg px-2.5 py-0.5 text-xs font-semibold text-seine-ink transition hover:bg-seine-card focus:outline-none focus:ring-2 focus:ring-seine-accent"
          aria-label="Copier la liste"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copié" : "Copier"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {grouped.map(([cat, items]) => (
          <div key={cat} className="rounded-xl border border-seine-border bg-seine-bg/60 px-3 py-2.5">
            <h3 className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-seine-muted">
              {CATEGORY_LABEL[cat]}
            </h3>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.label} className="flex items-baseline gap-2 text-sm text-seine-ink">
                  <span aria-hidden>{item.emoji}</span>
                  <span className="flex-1">
                    {item.label}
                    {item.note ? (
                      <span className="ml-1 text-[11px] italic text-seine-muted">— {item.note}</span>
                    ) : null}
                  </span>
                  <span className="font-mono text-xs font-semibold text-seine-ink/80">{item.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-seine-muted">{list.summary}</p>
    </Card>
  );
}

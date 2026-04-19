import { ShoppingBasket } from "lucide-react";
import { Card } from "./Card";
import { StrawberryDot, WaffleDot } from "./Illustration";
import type { Briefing } from "@/lib/types";

interface Item {
  label: string;
  qty: string;
  note?: string;
}

function buildList(batterPct: number, topping: string, mode: "crepe" | "glace"): Item[] {
  const scale = batterPct / 100;
  const eggs = Math.round(18 * scale);
  const flour = Math.round(1.5 * scale * 10) / 10;
  const milk = Math.round(1.8 * scale * 10) / 10;
  const butter = Math.round(250 * scale);
  const sugar = Math.round(180 * scale);

  const base: Item[] = [
    { label: "Œufs", qty: `${eggs} u.` },
    { label: "Farine T45", qty: `${flour} kg` },
    { label: "Lait entier", qty: `${milk} L` },
    { label: "Beurre doux", qty: `${butter} g` },
    { label: "Sucre semoule", qty: `${sugar} g` }
  ];

  if (mode === "glace") {
    base.push({ label: "Bacs glace vanille", qty: `${Math.round(2 * scale)}` });
    base.push({ label: "Sorbet citron", qty: `${Math.round(1.5 * scale)} bac` });
    base.push({ label: "Cornets", qty: `${Math.round(80 * scale)} u.` });
  } else {
    base.push({ label: "Nutella", qty: `${Math.round(1 * scale * 10) / 10} kg` });
    base.push({ label: "Chantilly UHT", qty: `${Math.round(1 * scale)} L` });
  }

  if (/fraise/i.test(topping)) base.push({ label: "Fraises", qty: `${Math.round(0.8 * scale)} kg`, note: "Gariguettes si dispo" });
  if (/banane/i.test(topping)) base.push({ label: "Bananes", qty: `${Math.round(1.2 * scale)} kg` });
  if (/citron/i.test(topping)) base.push({ label: "Citrons", qty: `${Math.round(6 * scale)} u.` });

  return base;
}

export function ShoppingListCard({ briefing }: { briefing: Briefing }) {
  const { recommendation, mode } = briefing;
  const items = buildList(recommendation.batterVolumePct, recommendation.topping, mode);

  return (
    <Card
      title="Courses du samedi"
      subtitle={`Volume ${Math.round(recommendation.batterVolumePct)} %`}
      icon={ShoppingBasket}
    >
      <div className="mb-3 flex items-center gap-2 rounded-2xl border border-seine-border bg-seine-sage/30 px-3 py-2">
        <WaffleDot className="h-8 w-8" />
        <StrawberryDot className="h-8 w-8" />
        <span className="text-xs text-seine-muted">
          Liste mise à l'échelle automatiquement selon la pâte prévue.
        </span>
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {items.map((it) => (
          <li
            key={it.label}
            className="flex items-center justify-between rounded-xl bg-seine-bg/40 px-3 py-2"
          >
            <span className="text-sm text-seine-ink">{it.label}</span>
            <span className="font-mono text-sm font-semibold text-seine-accent">{it.qty}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-seine-muted">
        À valider la veille au Leclerc Cormeilles ou au marché La Frette.
      </p>
    </Card>
  );
}

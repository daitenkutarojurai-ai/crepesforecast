import type {
  DrinkStock,
  Mode,
  NapkinForecast,
  ShoppingItem,
  ShoppingList
} from "./types";

const NAPKIN_MULT: Record<NapkinForecast["risk"], number> = {
  low: 1,
  moderate: 1.5,
  high: 2
};

const DRINK_MULT: Record<DrinkStock["tier"], number> = {
  base: 1,
  renforcé: 1.4,
  canicule: 1.8
};

function fmtKg(base: number, ratio: number): string {
  const v = base * ratio;
  return v >= 1 ? `${v.toFixed(v >= 5 ? 0 : 1)} kg` : `${Math.round(v * 1000)} g`;
}

function fmtL(base: number, ratio: number): string {
  const v = base * ratio;
  return v >= 1 ? `${v.toFixed(v >= 5 ? 0 : 1)} L` : `${Math.round(v * 100)} cL`;
}

function fmtCount(base: number, ratio: number, suffix: string): string {
  const v = Math.max(1, Math.round(base * ratio));
  return `${v} ${suffix}`;
}

function fmtDozens(base: number, ratio: number): string {
  const eggs = Math.max(6, Math.round((base * ratio) / 6) * 6);
  return `${eggs} (${Math.round(eggs / 6)} demi-douz.)`;
}

export function buildShoppingList(
  batterVolumePct: number,
  mode: Mode,
  napkin: NapkinForecast,
  drinks: DrinkStock
): ShoppingList {
  const ratio = batterVolumePct / 100;
  const napkinMult = NAPKIN_MULT[napkin.risk];
  const drinkMult = DRINK_MULT[drinks.tier];
  const glaceBoost = mode === "glace" ? 1.6 : 0.9;

  const items: ShoppingItem[] = [
    { category: "pâte", emoji: "🌾", label: "Farine de blé T45", qty: fmtKg(2.5, ratio) },
    { category: "pâte", emoji: "🥚", label: "Œufs frais", qty: fmtDozens(30, ratio) },
    { category: "pâte", emoji: "🥛", label: "Lait demi-écrémé", qty: fmtL(4, ratio) },
    { category: "pâte", emoji: "🧈", label: "Beurre doux", qty: fmtKg(0.5, ratio), note: "pâte + cuisson" },
    { category: "pâte", emoji: "🍬", label: "Sucre cristal", qty: fmtKg(1, ratio) },
    { category: "pâte", emoji: "🧂", label: "Sel fin", qty: "1 paquet", note: "stock permanent" },

    { category: "topping", emoji: "🍫", label: "Nutella (pot 1 kg)", qty: fmtCount(2, ratio, "pots") },
    { category: "topping", emoji: "❄️", label: "Sucre glace", qty: fmtKg(0.5, ratio), note: "finition gaufre" },
    { category: "topping", emoji: "🍓", label: "Confiture fraise", qty: fmtCount(2, ratio, "pots") },
    { category: "topping", emoji: "🍋", label: "Citrons (zeste/jus)", qty: fmtCount(8, ratio, "pièces") },
    { category: "topping", emoji: "🥛", label: "Chantilly (bombe)", qty: fmtCount(2, ratio, "bombes") },

    {
      category: "glace",
      emoji: "🍦",
      label: "Bac vanille (5 L)",
      qty: fmtCount(2 * glaceBoost, ratio, "bacs"),
      note: mode === "glace" ? "mode glace : prio" : undefined
    },
    {
      category: "glace",
      emoji: "🍫",
      label: "Bac chocolat (5 L)",
      qty: fmtCount(2 * glaceBoost, ratio, "bacs")
    },
    {
      category: "glace",
      emoji: "🍧",
      label: "Sorbet citron/fraise",
      qty: fmtCount(2 * glaceBoost, ratio, "bacs")
    },
    {
      category: "glace",
      emoji: "🍨",
      label: "Cônes gaufrés",
      qty: fmtCount(60 * glaceBoost, ratio, "cônes")
    },

    {
      category: "boisson",
      emoji: "💧",
      label: "Eau plate 50 cL",
      qty: fmtCount(24 * drinkMult, 1, "bouteilles"),
      note: drinks.tier === "canicule" ? "canicule : eau offerte enfants" : undefined
    },
    { category: "boisson", emoji: "🥤", label: "Sodas canette", qty: fmtCount(24 * drinkMult, 1, "canettes") },
    { category: "boisson", emoji: "🍋", label: "Citrons citronnade", qty: fmtCount(12 * drinkMult, 1, "pièces") },
    { category: "boisson", emoji: "☕", label: "Café grain", qty: "250 g", note: "stock permanent" },

    {
      category: "conso",
      emoji: "🧻",
      label: "Serviettes papier",
      qty: fmtCount(200 * napkinMult, ratio, "serviettes"),
      note: napkin.risk === "high" ? "pollen élevé · double pile" : undefined
    },
    { category: "conso", emoji: "🥣", label: "Bols carton", qty: fmtCount(80, ratio, "bols") },
    { category: "conso", emoji: "🥄", label: "Cuillères bois", qty: fmtCount(80, ratio, "pièces") },
    { category: "conso", emoji: "🛍️", label: "Sacs kraft", qty: fmtCount(60, ratio, "sacs") }
  ];

  const summary =
    `Liste calibrée sur ${Math.round(batterVolumePct)} % de pâte` +
    ` · mode ${mode === "glace" ? "Glace" : "Crêpe"}` +
    ` · boissons ${drinks.tier}` +
    ` · serviettes ×${napkinMult}.`;

  return {
    batterRatio: ratio,
    napkinMultiplier: napkinMult,
    drinkTier: drinks.tier,
    items,
    summary
  };
}

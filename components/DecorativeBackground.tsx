import { Anchor, Cookie, IceCreamCone, Ship, Sparkles, Star } from "lucide-react";

export function DecorativeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#fdedc8] via-[#fdf3e3] to-[#f5e8ce]" />

      <div className="absolute left-[-40px] top-[60px] text-[140px] opacity-20">🥞</div>
      <div className="absolute right-[-30px] top-[120px] text-[120px] opacity-15">🧇</div>
      <div className="absolute left-[6%] top-[520px] text-[90px] opacity-20">🍦</div>
      <div className="absolute right-[4%] top-[680px] text-[100px] opacity-15">🥐</div>
      <div className="absolute left-[10%] bottom-[120px] text-[80px] opacity-20">🍓</div>
      <div className="absolute right-[6%] bottom-[60px] text-[110px] opacity-15">🥞</div>

      <Anchor
        className="absolute right-[3%] top-[30%] h-14 w-14 -rotate-12 text-seine-accent opacity-20"
        strokeWidth={1.3}
      />
      <Ship
        className="absolute left-[4%] top-[42%] h-12 w-12 text-seine-accent opacity-20"
        strokeWidth={1.3}
      />
      <IceCreamCone
        className="absolute right-[10%] top-[55%] h-10 w-10 rotate-6 text-seine-crepe opacity-30"
        strokeWidth={1.4}
      />
      <Cookie
        className="absolute left-[7%] top-[72%] h-10 w-10 -rotate-6 text-seine-crepe opacity-30"
        strokeWidth={1.4}
      />
      <Sparkles
        className="absolute right-[18%] top-[8%] h-6 w-6 text-seine-warn opacity-45"
        strokeWidth={1.4}
      />
      <Star
        className="absolute left-[18%] top-[12%] h-5 w-5 text-seine-warn opacity-45"
        strokeWidth={1.4}
      />
      <Sparkles
        className="absolute left-[52%] top-[25%] h-4 w-4 text-seine-accent opacity-35"
        strokeWidth={1.4}
      />
      <Star
        className="absolute right-[22%] bottom-[18%] h-5 w-5 text-seine-warn opacity-40"
        strokeWidth={1.4}
      />
    </div>
  );
}

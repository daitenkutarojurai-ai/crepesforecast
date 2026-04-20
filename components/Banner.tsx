"use client";

import { useState } from "react";
import { QuaiScene } from "./Illustration";

export function Banner({ className = "" }: { className?: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-seine-border ${className}`}>
      {broken ? (
        <QuaiScene className="absolute inset-0 h-full w-full" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/newbanner.png"
          alt="Caravane Glaces en Seine sur le quai"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}

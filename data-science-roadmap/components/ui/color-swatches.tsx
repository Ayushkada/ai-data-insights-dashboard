// components/ColorSwatches.tsx
"use client";

import React from "react";

const PAIRS = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted", "muted-foreground"],
  ["accent", "accent-foreground"],
  ["destructive", "destructive-foreground"],
  ["sidebar-background", "sidebar-foreground"],
  ["sidebar-primary", "sidebar-primary-foreground"],
  ["sidebar-accent", "sidebar-accent-foreground"],
];

const SINGLES = [
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
];

export default function ColorSwatches() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* paired bg/text tokens */}
      {PAIRS.map(([bg, fg]) => (
        <div
          key={bg}
          className={`rounded-md p-4 border border-border bg-${bg} text-${fg}`}
        >
          <p className="font-semibold capitalize">{bg}</p>
          <p className="text-xs opacity-70">{fg}</p>
        </div>
      ))}

      {/* single‑use tokens */}
      {SINGLES.map((name) => (
        <div
          key={name}
          className="rounded-md p-4 border border-border text-sm font-semibold text-foreground"
          style={{ backgroundColor: `hsl(var(--${name}))` }}
        >
          {name}
        </div>
      ))}
    </div>
  );
}

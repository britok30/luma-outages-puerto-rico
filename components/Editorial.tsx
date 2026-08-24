"use client";

import { useEffect, useState, type ReactNode } from "react";
import { formatNumber } from "@/lib/i18n";

/* ---------- Layout ---------- */

export const Container = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 ${className}`}>
    {children}
  </div>
);

/** Two-column editorial split: sticky narrative on the left, content on the right. */
export const Split = ({
  aside,
  children,
  tone = "cream",
  id,
}: {
  aside: ReactNode;
  children: ReactNode;
  tone?: "cream" | "ink" | "olive";
  id?: string;
}) => {
  const tones = {
    cream: "bg-cream text-ink border-cream-3",
    ink: "bg-ink text-cream border-ink-3",
    olive: "bg-olive text-cream border-olive-2",
  };
  return (
    <section
      id={id}
      className={`${tones[tone]} border-t scroll-mt-14`}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 py-12 lg:py-20 lg:pr-16">
            <div className="lg:sticky lg:top-24">{aside}</div>
          </div>
          <div
            className={`lg:col-span-7 lg:border-l ${
              tone === "cream" ? "border-cream-3" : tone === "ink" ? "border-ink-3" : "border-olive-2"
            } lg:pl-16 pb-12 lg:py-20`}
          >
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
};

export const Eyebrow = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <p className={`eyebrow ${className}`}>{children}</p>;

/* ---------- Data primitives ---------- */

/** Oversized number with its meaning underneath in a muted tone. */
export const BigStat = ({
  value,
  label,
  note,
  size = "lg",
  muted = "text-pr-blue",
  className = "",
}: {
  value: string;
  label: string;
  note?: string;
  size?: "sm" | "md" | "lg" | "xl";
  muted?: string;
  className?: string;
}) => {
  const sizes = {
    sm: "text-3xl sm:text-4xl",
    md: "text-4xl sm:text-5xl",
    lg: "text-5xl sm:text-6xl lg:text-7xl",
    xl: "text-6xl sm:text-7xl lg:text-8xl",
  };
  return (
    <div className={className}>
      <p className={`display tabular-nums whitespace-nowrap ${sizes[size]}`}>{value}</p>
      <p className={`display ${sizes[size]} ${muted}`}>{label}</p>
      {note && <p className="mt-4 text-base sm:text-lg opacity-80">{note}</p>}
    </div>
  );
};

/** A vertical stack of stats separated by hairlines, like a ledger. */
export const StatLedger = ({
  items,
  divider = "border-cream-3",
  muted,
}: {
  items: Array<{ value: string; label: string; note?: string }>;
  divider?: string;
  muted?: string;
}) => (
  <div className={`divide-y ${divider}`}>
    {items.map((it) => (
      <div key={it.label} className="py-8 first:pt-0 last:pb-0">
        <BigStat value={it.value} label={it.label} note={it.note} size="md" muted={muted} />
      </div>
    ))}
  </div>
);

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

/** Thin horizontal bars — the whole "chart", in HTML. */
export const BarList = ({
  items,
  max,
  unit = "%",
  track = "bg-cream-3",
  fill = "bg-ink",
  divider = "border-cream-3",
  muted = "text-moss",
  format = (v: number) => `${v}${unit}`,
}: {
  items: Array<{ label: string; value: number; note?: string; fill?: string }>;
  max?: number;
  unit?: string;
  track?: string;
  fill?: string;
  divider?: string;
  muted?: string;
  format?: (v: number) => string;
}) => {
  const mounted = useMounted();
  const top = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className={`divide-y ${divider}`}>
      {items.map((it, i) => {
        const pct = Math.max(0, Math.min(100, (it.value / top) * 100));
        return (
          <li key={it.label} className="py-4 first:pt-0">
            <div className="flex items-baseline justify-between gap-6">
              <span className="text-base sm:text-lg">{it.label}</span>
              <span className="display text-2xl sm:text-3xl tabular-nums">
                {format(it.value)}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={it.label}
              aria-valuemin={0}
              aria-valuemax={top}
              aria-valuenow={it.value}
              className={`mt-2.5 h-[3px] w-full ${track}`}
            >
              <div
                className={`h-full ${it.fill ?? fill} transition-[width] duration-1000 ease-out`}
                style={{
                  width: mounted ? `${pct}%` : "0%",
                  transitionDelay: `${i * 60}ms`,
                }}
              />
            </div>
            {it.note && <p className={`mt-2 text-sm ${muted}`}>{it.note}</p>}
          </li>
        );
      })}
    </ul>
  );
};

/** Two-tone proportion bar for a binary split (e.g. insured vs. uninsured). */
export const SplitBar = ({
  a,
  b,
  colorA = "bg-cream",
  colorB = "bg-ember",
  muted = "text-moss-2",
}: {
  a: { label: string; value: number };
  b: { label: string; value: number };
  colorA?: string;
  colorB?: string;
  muted?: string;
}) => {
  const mounted = useMounted();
  const total = a.value + b.value || 1;
  const pa = (a.value / total) * 100;
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden">
        <div
          className={`${colorA} transition-[width] duration-1000 ease-out`}
          style={{ width: mounted ? `${pa}%` : "100%" }}
        />
        <div className={`${colorB} flex-1`} />
      </div>
      <div className={`mt-3 flex justify-between text-sm ${muted}`}>
        <span>
          <span className={`inline-block w-2 h-2 mr-2 align-middle ${colorA}`} />
          {a.label} · {a.value}%
        </span>
        <span>
          {b.label} · {b.value}%
          <span className={`inline-block w-2 h-2 ml-2 align-middle ${colorB}`} />
        </span>
      </div>
    </div>
  );
};

export const Source = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <p className={`mt-10 text-xs opacity-60 ${className}`}>{children}</p>;

export const money = (n: number) => `$${formatNumber(n)}`;

"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { useLang, formatNumber, type Lang } from "@/lib/i18n";
import type { History as HistoryData, HistoryRange } from "@/lib/db/snapshots";
import { Eyebrow, Source, Split } from "./Editorial";

const fetcher = async (url: string): Promise<HistoryData> => {
  const res = await fetch(url);
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || !("outages" in body)) throw new Error(body?.error ?? `Request failed (${res.status})`);
  return body as HistoryData;
};

const RANGES: HistoryRange[] = ["24h", "7d", "30d"];

const fmtTime = (iso: string, range: HistoryRange, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "es" ? "es-PR" : "en-US", {
    timeZone: "America/Puerto_Rico",
    ...(range === "24h"
      ? { hour: "numeric", minute: "2-digit" }
      : { month: "short", day: "numeric", ...(range === "7d" ? { hour: "numeric" } : {}) }),
  }).format(new Date(iso));

const fmtFull = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "es" ? "es-PR" : "en-US", {
    timeZone: "America/Puerto_Rico",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

interface Series {
  t: number;
  v: number;
  iso: string;
}

/** Plain-SVG area chart: one series, hairline grid, hover readout. */
const TrendChart = ({
  points,
  range,
  color,
  unit = "",
  height = 220,
}: {
  points: Series[];
  range: HistoryRange;
  color: string;
  unit?: string;
  height?: number;
}) => {
  const { lang } = useLang();
  const [hover, setHover] = useState<number | null>(null);
  const W = 800;
  const H = height;
  const PAD = { l: 8, r: 8, t: 16, b: 28 };

  const { path, area, xs, ys, max, ticks, peakIdx } = useMemo(() => {
    const t0 = points[0].t;
    const t1 = points[points.length - 1].t;
    const span = Math.max(1, t1 - t0);
    const max = Math.max(1, ...points.map((p) => p.v)) * 1.08;
    const xs = points.map((p) => PAD.l + ((p.t - t0) / span) * (W - PAD.l - PAD.r));
    const ys = points.map((p) => PAD.t + (1 - p.v / max) * (H - PAD.t - PAD.b));
    const path = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
    const area = `${path} L${xs[xs.length - 1].toFixed(1)},${H - PAD.b} L${xs[0].toFixed(1)},${H - PAD.b} Z`;
    const ticks = [0.25, 0.5, 0.75, 1].map((f) => ({
      y: PAD.t + (1 - f) * (H - PAD.t - PAD.b),
      v: Math.round((max * f) / 1.08),
    }));
    let peakIdx = 0;
    points.forEach((p, i) => { if (p.v > points[peakIdx].v) peakIdx = i; });
    return { path, area, xs, ys, max, ticks, peakIdx };
  }, [points, H]);

  const xLabels = useMemo(() => {
    const n = 4;
    const seen = new Set<number>();
    return Array.from({ length: n + 1 }, (_, i) => Math.round((i / n) * (points.length - 1)))
      .filter((idx) => (seen.has(idx) ? false : (seen.add(idx), true)))
      .map((idx, i, all) => ({
        x: xs[idx],
        label: fmtTime(points[idx].iso, range, lang),
        anchor: (i === 0 ? "start" : i === all.length - 1 ? "end" : "middle") as "start" | "end" | "middle",
      }));
  }, [points, xs, range, lang]);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    xs.forEach((px, i) => { const d = Math.abs(px - x); if (d < bestD) { bestD = d; best = i; } });
    setHover(best);
  };

  const h = hover ?? points.length - 1;
  const hx = xs[h];
  const hy = ys[h];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={`${formatNumber(points[h].v)}${unit} — ${fmtFull(points[h].iso, lang)}`}
      >
        {ticks.map((tk) => (
          <g key={tk.y}>
            <line x1={PAD.l} x2={W - PAD.r} y1={tk.y} y2={tk.y} stroke="currentColor" strokeOpacity={0.12} strokeWidth={1} />
            <text x={W - PAD.r} y={tk.y - 4} textAnchor="end" fontSize={11} fill="currentColor" fillOpacity={0.5}>
              {formatNumber(tk.v)}{unit}
            </text>
          </g>
        ))}
        <path d={area} fill={color} fillOpacity={0.12} />
        <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {/* peak marker */}
        <circle cx={xs[peakIdx]} cy={ys[peakIdx]} r={3.5} fill={color} />
        {/* hover */}
        <line x1={hx} x2={hx} y1={PAD.t} y2={H - PAD.b} stroke="currentColor" strokeOpacity={hover === null ? 0 : 0.35} strokeWidth={1} />
        <circle cx={hx} cy={hy} r={hover === null ? 0 : 4.5} fill={color} stroke="currentColor" strokeWidth={1.5} />
        {xLabels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={H - 8}
            textAnchor={l.anchor}
            fontSize={11}
            fill="currentColor"
            fillOpacity={0.5}
            suppressHydrationWarning
          >
            {l.label}
          </text>
        ))}
      </svg>
      <div className="mt-2 flex items-baseline justify-between text-sm">
        <span className="opacity-60 tabular-nums" suppressHydrationWarning>{fmtFull(points[h].iso, lang)}</span>
        <span className="display text-2xl tabular-nums" style={{ color }}>
          {formatNumber(points[h].v)}{unit}
        </span>
      </div>
    </div>
  );
};

export const History = ({ fallbackData }: { fallbackData?: HistoryData }) => {
  const { t, lang } = useLang();
  const [range, setRange] = useState<HistoryRange>(fallbackData?.range ?? "7d");
  const { data, error } = useSWR<HistoryData>(`/api/history?range=${range}`, fetcher, {
    fallbackData: fallbackData?.range === range ? fallbackData : undefined,
    keepPreviousData: true,
    refreshInterval: 5 * 60 * 1000,
  });

  if (!data && !error) return null;
  if (!data) return null;

  const outages: Series[] = data.outages.map((p) => ({ t: Date.parse(p.t), v: p.without, iso: p.t }));
  const reserve: Series[] = data.system.map((p) => ({ t: Date.parse(p.t), v: p.reserve, iso: p.t }));
  const enough = outages.length >= 2;

  const peak = outages.reduce((m, p) => (p.v > m.v ? p : m), outages[0] ?? { v: 0, iso: "", t: 0 });
  const loadShedEvents = data.outages.filter((p) => p.loadShed > 0).length;

  return (
    <Split
      id="history"
      tone="cream"
      aside={
        <>
          <Eyebrow className="text-moss">{t("Historial", "History")}</Eyebrow>
          <h2 className="display text-4xl sm:text-5xl mt-6">
            {t("Lo que LUMA no guarda.", "What LUMA doesn't keep.")}
          </h2>
          <p className="mt-8 text-lg text-ink/70 max-w-md">
            {t(
              "LUMA solo publica el estado actual. Desde que empezamos a guardar cada actualización, esta es la curva de clientes sin servicio.",
              "LUMA only publishes the current state. Since we started saving every update, this is the curve of customers without service."
            )}
          </p>
          {data.since && (
            <p className="mt-4 text-sm text-moss" suppressHydrationWarning>
              {t("Registrando desde", "Tracking since")} {fmtFull(data.since, lang)} ·{" "}
              {formatNumber(outages.length)} {t("actualizaciones en este rango", "updates in this range")}
              {loadShedEvents > 0 &&
                ` · ${formatNumber(loadShedEvents)} ${t("con relevo de carga", "with load shedding")}`}
            </p>
          )}
          <div role="group" aria-label={t("Rango", "Range")} className="mt-8 flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                aria-pressed={r === range}
                className={`eyebrow px-3 py-2 border transition-colors ${
                  r === range ? "bg-ink text-cream border-ink" : "border-ink/20 text-moss hover:border-ink"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      }
    >
      {enough ? (
        <>
          <div className="flex items-baseline justify-between gap-6 mb-4">
            <Eyebrow className="text-moss">{t("Clientes sin servicio", "Customers without service")}</Eyebrow>
            <span className="text-sm text-moss tabular-nums" suppressHydrationWarning>
              {t("Pico", "Peak")}: {formatNumber(peak.v)} · {fmtFull(peak.iso, lang)}
            </span>
          </div>
          <TrendChart points={outages} range={range} color="#e92228" />

          {reserve.length >= 2 && (
            <div className="mt-14">
              <Eyebrow className="text-moss mb-4">{t("Reserva de generación", "Generation reserve")}</Eyebrow>
              <TrendChart points={reserve} range={range} color="#2b8fd0" unit=" MW" height={160} />
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center text-moss">
          <p className="display text-3xl text-ink">
            {t("Recopilando datos.", "Collecting data.")}
          </p>
          <p className="mt-3 text-sm max-w-sm mx-auto">
            {t(
              "Guardamos cada actualización de LUMA. La gráfica aparecerá en cuanto haya suficientes puntos.",
              "We save every LUMA update. The chart will appear once there are enough points."
            )}
          </p>
        </div>
      )}
      <Source>
        {t("Fuente", "Source")}: LUMA Energy, {t("guardado por Apagón Puerto Rico cada ~5 minutos", "recorded by Apagón Puerto Rico every ~5 minutes")}.
      </Source>
    </Split>
  );
};

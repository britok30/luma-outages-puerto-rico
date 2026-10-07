"use client";

import { useMemo, useState } from "react";
import { PR_REGION_PATHS, PR_VIEWBOX } from "@/lib/pr-paths";
import { Regions } from "@/lib/types";
import { useLang, formatNumber } from "@/lib/i18n";
import { severityHex } from "./RegionLedger";
import { MapLegend } from "./MapLegend";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

/**
 * Lightweight choropleth of LUMA's seven regions: inline SVG, no map tiles or
 * WebGL, so it renders instantly on a weak connection. The Mapbox map is
 * loaded only when someone asks for it.
 */
export const RegionMap = ({ regions }: { regions: Regions[] }) => {
  const { t } = useLang();
  const [active, setActive] = useState<string | null>(null);

  const shapes = useMemo(() => {
    const byName = new Map(regions.map((r) => [normalize(r.name), r]));
    return PR_REGION_PATHS.map((p) => ({ ...p, region: byName.get(normalize(p.name)) }));
  }, [regions]);

  const current = shapes.find((s) => s.name === active);

  return (
    <div className="w-full h-full relative flex items-center justify-center px-4 sm:px-8 pt-16 pb-28 sm:pb-24">
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${PR_VIEWBOX.width} ${PR_VIEWBOX.height}`}
          className="w-full h-auto block"
          role="group"
          aria-label={t("Mapa de regiones de LUMA", "Map of LUMA regions")}
          onPointerLeave={() => setActive(null)}
        >
          {shapes.map((s) => {
            const pct = s.region?.percentageClientsWithoutService ?? 0;
            const label = s.region
              ? `${s.region.name}: ${pct.toFixed(1)}% ${t("sin servicio", "without service")}`
              : `${s.name}: ${t("sin datos", "no data")}`;
            return (
              <path
                key={s.name}
                d={s.d}
                role="button"
                tabIndex={0}
                aria-label={label}
                fill={s.region ? severityHex(pct) : "var(--color-cream-3)"}
                fillOpacity={active && active !== s.name ? 0.55 : 0.9}
                stroke={active === s.name ? "var(--color-ink)" : "var(--color-cream)"}
                strokeWidth={active === s.name ? 2.5 : 0.75}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className="cursor-pointer outline-none transition-[fill-opacity] duration-150"
                onPointerEnter={() => setActive(s.name)}
                onClick={() => setActive(s.name)}
                onFocus={() => setActive(s.name)}
                onBlur={() => setActive(null)}
              />
            );
          })}
          {/* Keep the active outline on top of its neighbours. */}
          {current && (
            <path
              d={current.d}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
          )}
        </svg>

        {current && <Tooltip shape={current} />}
      </div>

      <MapLegend />
    </div>
  );
};

const Tooltip = ({
  shape,
}: {
  shape: (typeof PR_REGION_PATHS)[number] & { region?: Regions };
}) => {
  const { t } = useLang();
  const r = shape.region;
  const pct = r?.percentageClientsWithoutService ?? 0;
  const [x, y] = shape.label;

  return (
    <div
      role="tooltip"
      className="absolute z-10 bg-ink text-cream px-3.5 py-2.5 text-left whitespace-nowrap shadow-[0_10px_30px_rgba(10,26,63,0.35)] pointer-events-none"
      style={{
        left: `${Math.min(Math.max((x / PR_VIEWBOX.width) * 100, 15), 85)}%`,
        top: `${(y / PR_VIEWBOX.height) * 100}%`,
        transform: "translate(-50%, calc(-100% - 10px))",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-block w-2 h-2" style={{ backgroundColor: severityHex(pct) }} aria-hidden />
        <p className="font-semibold text-sm">{r?.name ?? shape.name}</p>
      </div>
      {r ? (
        <ul className="text-xs space-y-0.5 tabular-nums">
          <li>
            <span className="text-moss-2">{t("Sin servicio", "Without service")}:</span>{" "}
            <span className="font-semibold">{formatNumber(r.totalClientsWithoutService)}</span>{" "}
            ({pct.toFixed(1)}%)
          </li>
          <li>
            <span className="text-moss-2">{t("Clientes totales", "Total customers")}:</span>{" "}
            {formatNumber(r.totalClients)}
          </li>
        </ul>
      ) : (
        <p className="text-xs text-moss-2">{t("Sin datos", "No data")}</p>
      )}
    </div>
  );
};

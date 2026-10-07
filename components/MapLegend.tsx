"use client";

import { useLang } from "@/lib/i18n";
import { severityHex } from "./RegionLedger";

/** Lower bound (% without service) of each severity step, with its color. */
export const SEVERITY_STEPS: Array<[number, string]> = [0, 1, 5, 20, 50].map((v) => [
  v,
  severityHex(v),
]);

export const MapLegend = () => {
  const { t } = useLang();
  const labels = ["<1%", "1–5%", "5–20%", "20–50%", "≥50%"];
  return (
    <div
      aria-label={t("Leyenda", "Legend")}
      className="absolute left-4 bottom-4 z-10 bg-cream/90 backdrop-blur-sm border border-cream-3 px-3 py-2.5 text-[11px] text-moss"
    >
      <p className="eyebrow text-ink mb-2">
        {t("Sin servicio", "Without service")}
      </p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {SEVERITY_STEPS.map(([, color], i) => (
          <li key={color} className="flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            {labels[i]}
          </li>
        ))}
      </ul>
    </div>
  );
};

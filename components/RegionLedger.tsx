"use client";

import { useEffect, useState } from "react";
import { Regions } from "@/lib/types";
import { useLang, formatNumber } from "@/lib/i18n";

/** Severity color shared by the ledger and the map. */
export const severityHex = (pct: number) => {
  if (pct >= 50) return "#9e1116"; // dark red
  if (pct >= 20) return "#e92228"; // flag red
  if (pct >= 5) return "#f0555a"; // light red
  if (pct >= 1) return "#f2b134"; // amber
  return "#2fbf71"; // tropical green
};

export const RegionLedger = ({ regions }: { regions: Regions[] }) => {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const top = Math.max(...regions.map((r) => r.percentageClientsWithoutService), 1);

  return (
    <ol className="divide-y divide-cream-3">
      {regions.map((r, i) => {
        const pct = r.percentageClientsWithoutService ?? 0;
        return (
          <li key={r.name} className="py-7 first:pt-0 last:pb-0 grid grid-cols-[2.5rem_1fr] gap-4">
            <span className="eyebrow text-moss pt-3 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="display text-3xl sm:text-4xl">{r.name}</h3>
                <span
                  className="display text-3xl sm:text-4xl tabular-nums"
                  style={{ color: pct >= 1 ? severityHex(pct) : undefined }}
                >
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`${r.name}: ${pct.toFixed(1)}% ${t("sin servicio", "without service")}`}
                aria-valuemin={0}
                aria-valuemax={Math.round(top * 10) / 10}
                aria-valuenow={Math.round(pct * 10) / 10}
                className="mt-4 h-[3px] w-full bg-cream-3"
              >
                <div
                  className="h-full transition-[width] duration-1000 ease-out"
                  style={{
                    width: mounted ? `${Math.max((pct / top) * 100, pct > 0 ? 1 : 0)}%` : "0%",
                    backgroundColor: severityHex(pct),
                    transitionDelay: `${i * 70}ms`,
                  }}
                />
              </div>
              <p className="mt-3 text-sm text-moss tabular-nums">
                {formatNumber(r.totalClientsWithoutService)} {t("de", "of")}{" "}
                {formatNumber(r.totalClients)} {t("clientes", "customers")}
                {(r.totalClientsAffectedByLoadShed ?? 0) > 0 && (
                  <span className="text-ember">
                    {" "}· {formatNumber(r.totalClientsAffectedByLoadShed)}{" "}
                    {t("por relevo de carga", "load shedding")}
                  </span>
                )}
                {(r.totalClientsAffectedByPlannedOutage ?? 0) > 0 && (
                  <span>
                    {" "}· {formatNumber(r.totalClientsAffectedByPlannedOutage)}{" "}
                    {t("planificados", "planned")}
                  </span>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

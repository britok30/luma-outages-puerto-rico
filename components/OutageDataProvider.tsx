"use client";

import useSWR from "swr";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Outage } from "@/lib/types";
import { useLang, formatNumber } from "@/lib/i18n";
import { Container, Eyebrow, Split } from "./Editorial";
import { LiveDot, UpdatedAt, useFreshness } from "./Freshness";
import { RegionLedger } from "./RegionLedger";

const PuertoRicoMap = dynamic(
  () => import("./PuertoRicoMap").then((m) => m.PuertoRicoMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-cream-2" /> }
);

class FetchError extends Error {
  status?: number;
}

const fetcher = async (url: string): Promise<Outage> => {
  const res = await fetch(url);
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || typeof body !== "object" || !("totals" in body)) {
    const err = new FetchError(body?.error ?? `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body as Outage;
};

export const OutageDataProvider = ({ fallbackData }: { fallbackData?: Outage }) => {
  const { t } = useLang();
  const { data: clients, error, isValidating, mutate } = useSWR<Outage>(
    "/api/outages",
    fetcher,
    {
      fallbackData,
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: true,
      keepPreviousData: true,
      errorRetryCount: 5,
    }
  );
  const { stale } = useFreshness(clients?.timestamp);

  const regions = useMemo(
    () =>
      [...(clients?.regions ?? [])].sort(
        (a, b) => b.percentageClientsWithoutService - a.percentageClientsWithoutService
      ),
    [clients]
  );

  if (!clients) {
    return error ? <ErrorState onRetry={() => mutate()} /> : <Skeleton />;
  }

  const { totals, timestamp } = clients;
  const without = totals?.totalClientsWithoutService ?? 0;
  const pct = totals?.totalPercentageWithoutService ?? 0;
  const loadShed = totals?.totalClientsAffectedByLoadShed ?? 0;
  const planned = totals?.totalClientsAffectedByPlannedOutage ?? 0;
  const unplanned = Math.max(0, without - loadShed - planned);
  const worst = regions[0];
  // Show LUMA's own precision (0.69%) rather than re-rounding it.
  const pctLabel = `${pct}%`;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section id="outages" className="grain bg-ink text-cream scroll-mt-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-3.5rem)]">
            <div className="lg:col-span-5 flex flex-col justify-between py-12 lg:py-16 lg:pr-12">
              <div>
                <Eyebrow className="text-moss-2 reveal">
                  <LiveDot stale={stale} />
                  {stale
                    ? t("Datos retrasados", "Data delayed")
                    : t("En vivo · Puerto Rico", "Live · Puerto Rico")}
                </Eyebrow>

                <h1 className="mt-10 lg:mt-16 reveal" style={{ animationDelay: "120ms" }}>
                  <span className="sr-only">
                    {t("Apagones en Puerto Rico ahora mismo: ", "Puerto Rico power outages right now: ")}
                  </span>
                  <span className="block display text-[4.5rem] sm:text-[6rem] lg:text-[7.5rem] tabular-nums">
                    {formatNumber(without)}
                  </span>{" "}
                  <span className="block display text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] text-sky mt-2">
                    {t("clientes sin luz", "customers without power")}
                  </span>
                </h1>

                <p
                  className="mt-8 text-lg sm:text-xl text-cream/80 max-w-md reveal"
                  style={{ animationDelay: "240ms" }}
                >
                  {t(
                    `${pctLabel} de los ${formatNumber(totals.totalClients)} clientes de LUMA.`,
                    `${pctLabel} of LUMA's ${formatNumber(totals.totalClients)} customers.`
                  )}{" "}
                  {worst &&
                    t(
                      `La región más afectada es ${worst.name}, con ${worst.percentageClientsWithoutService}% sin servicio.`,
                      `The hardest-hit region is ${worst.name}, at ${worst.percentageClientsWithoutService}% without service.`
                    )}
                </p>

                {(loadShed > 0 || planned > 0) && (
                  <ul
                    className="mt-6 flex flex-wrap gap-x-8 gap-y-3 reveal"
                    style={{ animationDelay: "300ms" }}
                  >
                    {loadShed > 0 && (
                      <li>
                        <p className="display text-2xl sm:text-3xl tabular-nums text-ember-2">
                          {formatNumber(loadShed)}
                        </p>
                        <p className="text-sm text-moss-2 mt-1">
                          {t("por relevo de carga", "from load shedding")}
                        </p>
                      </li>
                    )}
                    {planned > 0 && (
                      <li>
                        <p className="display text-2xl sm:text-3xl tabular-nums text-ochre">
                          {formatNumber(planned)}
                        </p>
                        <p className="text-sm text-moss-2 mt-1">
                          {t("por mantenimiento planificado", "from planned maintenance")}
                        </p>
                      </li>
                    )}
                    <li>
                      <p className="display text-2xl sm:text-3xl tabular-nums">
                        {formatNumber(unplanned)}
                      </p>
                      <p className="text-sm text-moss-2 mt-1">
                        {t("por averías", "unplanned")}
                      </p>
                    </li>
                  </ul>
                )}
              </div>

              <div
                className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-moss-2 reveal"
                style={{ animationDelay: "360ms" }}
              >
                <UpdatedAt timestamp={timestamp} />
                <button
                  type="button"
                  onClick={() => mutate()}
                  disabled={isValidating}
                  className="eyebrow hover:text-cream disabled:opacity-40 transition-colors"
                >
                  {isValidating ? t("Actualizando…", "Refreshing…") : t("Actualizar", "Refresh")}
                </button>
                {error && (
                  <span role="status" className="text-ochre">
                    {t(
                      "LUMA no respondió; mostrando el último dato disponible.",
                      "LUMA didn't respond; showing the last available data."
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 lg:border-l border-ink-3 relative min-h-[420px] lg:min-h-0">
              <div className="absolute inset-0">
                <PuertoRicoMap regions={regions} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Totals strip ---------- */}
      <section className="bg-ink text-cream border-t border-ink-3">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 lg:divide-x divide-ink-3">
            {[
              {
                v: formatNumber(totals.totalClientsWithoutService),
                l: t("sin servicio", "without service"),
                s: pctLabel,
                c: "text-ember-2",
              },
              {
                v: formatNumber(loadShed),
                l: t("por relevo de carga", "from load shedding"),
                s: totals.totalClients ? `${((loadShed / totals.totalClients) * 100).toFixed(2)}%` : "",
                c: loadShed > 0 ? "text-ember-2" : "text-moss-2",
              },
              {
                v: formatNumber(planned),
                l: t("mantenimiento planificado", "planned maintenance"),
                s: totals.totalClients ? `${((planned / totals.totalClients) * 100).toFixed(2)}%` : "",
                c: planned > 0 ? "text-ochre" : "text-moss-2",
              },
              {
                v: formatNumber(totals.totalClientsWithService),
                l: t("con servicio", "with service"),
                s: `${totals.totalPercentageWithService ?? 0}%`,
                c: "text-sage",
              },
              {
                v: formatNumber(totals.totalClients),
                l: t("clientes totales", "total customers"),
                s: "LUMA",
                c: "text-moss-2",
              },
            ].map((s) => (
              <div key={s.l} className="py-8 lg:px-6 lg:first:pl-0 lg:last:pr-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="display text-3xl sm:text-4xl tabular-nums">{s.v}</p>
                  <span className={`eyebrow ${s.c}`}>{s.s}</span>
                </div>
                <p className="mt-2 text-base text-moss-2">{s.l}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Regions ---------- */}
      <Split
        id="regions"
        tone="cream"
        aside={
          <>
            <Eyebrow className="text-moss">{t("Por región", "By region")}</Eyebrow>
            <h2 className="display text-4xl sm:text-5xl mt-6">
              {t("Siete regiones, una red.", "Seven regions, one grid.")}
            </h2>
            <p className="mt-8 text-lg text-ink/70 max-w-md">
              {t(
                "LUMA divide la isla en siete regiones operativas. Cada barra muestra la proporción de clientes sin servicio en este momento, ordenadas de mayor a menor.",
                "LUMA divides the island into seven operating regions. Each bar shows the share of customers currently without service, ordered from most to least affected."
              )}
            </p>
          </>
        }
      >
        <RegionLedger regions={regions} />
      </Split>
    </>
  );
};

const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useLang();
  return (
    <section id="outages" className="bg-ink text-cream">
      <Container className="py-24">
        <Eyebrow className="text-ochre">{t("Sin datos", "No data")}</Eyebrow>
        <h2 className="display text-4xl sm:text-6xl mt-6 max-w-2xl">
          {t("No pudimos hablar con LUMA.", "We couldn't reach LUMA.")}
        </h2>
        <p className="mt-6 text-lg text-moss-2 max-w-lg">
          {t(
            "El servicio de datos no respondió. Puedes intentar de nuevo o consultar el mapa oficial.",
            "The data service didn't respond. You can try again or check the official map."
          )}
        </p>
        <div className="mt-10 flex flex-wrap gap-6 eyebrow">
          <button type="button" onClick={onRetry} className="bg-cream text-ink px-5 py-3 hover:bg-cream-2 transition-colors">
            {t("Reintentar", "Retry")}
          </button>
          <a
            href="https://miluma.lumapr.com/outages/outageMap"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-cream/40 px-5 py-3 hover:border-cream transition-colors"
          >
            {t("Mapa oficial de LUMA", "Official LUMA map")}
          </a>
        </div>
      </Container>
    </section>
  );
};

const Skeleton = () => (
  <section aria-busy="true" className="bg-ink text-cream">
    <Container>
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-3.5rem)]">
        <div className="lg:col-span-5 py-16 space-y-6">
          <div className="h-3 w-40 bg-ink-3 animate-pulse" />
          <div className="h-24 w-80 bg-ink-3 animate-pulse mt-16" />
          <div className="h-10 w-64 bg-ink-3 animate-pulse" />
        </div>
        <div className="lg:col-span-7 bg-ink-2 animate-pulse min-h-[420px]" />
      </div>
    </Container>
  </section>
);

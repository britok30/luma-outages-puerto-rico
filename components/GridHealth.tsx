"use client";

import useSWR from "swr";
import type { SystemOverview } from "@/lib/types";
import { useLang, formatNumber } from "@/lib/i18n";
import { BarList, BigStat, Eyebrow, Source, Split } from "./Editorial";

const fetcher = async (url: string): Promise<SystemOverview> => {
  const res = await fetch(url);
  const body = await res.json().catch(() => null);
  if (!res.ok || !body || typeof body !== "object" || !("demandMw" in body)) {
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return body as SystemOverview;
};

/** Reserve margin thresholds (MW). LUMA sheds load when reserves hit zero. */
const reserveTone = (reserveMw: number) => {
  if (reserveMw < 150) return { color: "text-ember-2", key: "critical" as const };
  if (reserveMw < 300) return { color: "text-ochre", key: "tight" as const };
  return { color: "text-sage", key: "ok" as const };
};

export const GridHealth = ({ fallbackData }: { fallbackData?: SystemOverview }) => {
  const { t, lang } = useLang();
  const { data, error } = useSWR<SystemOverview>("/api/system", fetcher, {
    fallbackData,
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });

  if (!data) return null;

  const margin = data.demandMw > 0 ? (data.reserveMw / data.demandMw) * 100 : 0;
  const tone = reserveTone(data.reserveMw);
  const toneLabel = {
    critical: t("reserva crítica", "critical reserve"),
    tight: t("reserva ajustada", "tight reserve"),
    ok: t("reserva adecuada", "adequate reserve"),
  }[tone.key];

  const plants = [...data.plants].sort((a, b) => b.mw - a.mw);
  const totalGen = plants.reduce((s, p) => s + p.mw, 0);
  const fetched = new Date(data.fetchedAt);
  const fetchedLabel = Number.isNaN(fetched.getTime())
    ? ""
    : new Intl.DateTimeFormat(lang === "es" ? "es-PR" : "en-US", {
        timeZone: "America/Puerto_Rico",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(fetched);

  return (
    <Split
      id="grid"
      tone="ink"
      aside={
        <>
          <Eyebrow className="text-moss-2">{t("Red eléctrica", "The grid")}</Eyebrow>
          <h2 className="display text-4xl sm:text-5xl mt-6">
            {t("Generación contra demanda, ahora mismo.", "Generation versus demand, right now.")}
          </h2>
          <p className="mt-8 text-lg text-cream/70 max-w-md">
            {t(
              "Cuando la reserva llega a cero, LUMA aplica relevos de carga: apagones rotativos para proteger el sistema. La reserva es el indicador más temprano de que viene uno.",
              "When reserves hit zero, LUMA sheds load — rolling blackouts to protect the system. Reserve margin is the earliest warning that one is coming."
            )}
          </p>
          {error && (
            <p role="status" className="mt-6 text-xs text-ochre">
              {t(
                "LUMA no respondió; mostrando el último dato disponible.",
                "LUMA didn't respond; showing the last available data."
              )}
            </p>
          )}
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-0 sm:divide-x divide-ink-3">
        <BigStat
          value={`${formatNumber(data.demandMw)} MW`}
          label={t("demanda actual", "current demand")}
          note={`${t("Próxima hora", "Next hour")}: ${formatNumber(data.nextHourDemandMw)} MW`}
          muted="text-sky"
          size="md"
          className="sm:pr-10"
        />
        <BigStat
          value={`${formatNumber(data.reserveMw)} MW`}
          label={t("en reserva", "in reserve")}
          note={`${margin.toFixed(1)}% ${t("de la demanda", "of demand")} · ${toneLabel}`}
          muted={tone.color}
          size="md"
          className="sm:pl-10"
        />
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-0 sm:divide-x divide-ink-3 border-t border-ink-3 pt-10">
        <BigStat
          value={data.peakDemandMw ? `${formatNumber(data.peakDemandMw)} MW` : "—"}
          label={t("demanda pico proyectada", "forecast peak demand")}
          muted="text-moss-2"
          size="md"
          className="sm:pr-10"
        />
        <BigStat
          value={data.peakReserveMw !== null ? `${formatNumber(data.peakReserveMw)} MW` : "—"}
          label={t("reserva proyectada al pico", "forecast reserve at peak")}
          muted={data.peakReserveMw !== null ? reserveTone(data.peakReserveMw).color : "text-moss-2"}
          size="md"
          className="sm:pl-10"
        />
      </div>

      <div className="mt-14">
        <Eyebrow className="text-moss-2 mb-6">
          {t("Generación por planta", "Generation by plant")} · {formatNumber(Math.round(totalGen))} MW
        </Eyebrow>
        <BarList
          items={plants.map((p) => ({
            label: p.name,
            value: p.mw,
            // Bar = utilization against the plant's own capacity, matching the note below it.
            max: p.maxMw ?? undefined,
            note: p.maxMw
              ? `${Math.round((p.mw / p.maxMw) * 100)}% ${t("de", "of")} ${formatNumber(p.maxMw)} MW ${t("de capacidad", "capacity")}`
              : undefined,
          }))}
          format={(v) => `${formatNumber(Math.round(v))} MW`}
          track="bg-ink-3"
          fill="bg-sky"
          divider="border-ink-3"
          muted="text-moss-2"
        />
      </div>

      <Source>
        {t("Fuente", "Source")}: LUMA Energy, System Overview
        {fetchedLabel && (
          <span suppressHydrationWarning>
            {" "}· {t("leído", "read")} {fetchedLabel}
          </span>
        )}
      </Source>
    </Split>
  );
};

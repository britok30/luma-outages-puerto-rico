"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import {
  formatInAST,
  formatRelative,
  parseLumaTimestamp,
  STALE_AFTER_MS,
} from "@/lib/time";

const useNow = () => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

export const useFreshness = (timestamp?: string) => {
  const now = useNow();
  const date = parseLumaTimestamp(timestamp);
  const stale = !!(now && date && now.getTime() - date.getTime() > STALE_AFTER_MS);
  return { now, date, stale };
};

export const LiveDot = ({ stale }: { stale: boolean }) => (
  <span className="relative inline-flex h-2 w-2 mr-2.5 align-middle" aria-hidden>
    {!stale && (
      <span className="motion-safe:animate-ping absolute inline-flex h-full w-full bg-sage opacity-70" />
    )}
    <span className={`relative inline-flex h-2 w-2 ${stale ? "bg-ochre" : "bg-sage"}`} />
  </span>
);

export const UpdatedAt = ({ timestamp }: { timestamp?: string }) => {
  const { t, lang } = useLang();
  const { now, date } = useFreshness(timestamp);
  if (!timestamp) return null;

  return (
    <span className="tabular-nums">
      {t("Actualizado por LUMA", "Updated by LUMA")}{" "}
      {date ? (
        <time dateTime={date.toISOString()} suppressHydrationWarning>
          {formatInAST(date, lang)}
          {now && ` · ${formatRelative(date, now, lang)}`}
        </time>
      ) : (
        timestamp
      )}
    </span>
  );
};

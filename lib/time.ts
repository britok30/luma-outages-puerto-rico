import type { Lang } from "./i18n";

/**
 * LUMA reports timestamps as "MM/DD/YYYY hh:mm AM" in Atlantic Standard Time
 * (UTC-4, no daylight saving). Returns null if the string can't be parsed.
 */
export const parseLumaTimestamp = (raw?: string): Date | null => {
  if (!raw) return null;
  const m = raw
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!m) {
    const fallback = new Date(raw);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
  const [, mm, dd, yyyy, hh, min, ss, ampm] = m;
  let hours = Number(hh);
  if (ampm) {
    const pm = ampm.toUpperCase() === "PM";
    if (pm && hours < 12) hours += 12;
    if (!pm && hours === 12) hours = 0;
  }
  return new Date(
    Date.UTC(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      hours + 4, // AST -> UTC
      Number(min),
      Number(ss ?? 0)
    )
  );
};

export const formatInAST = (date: Date, lang: Lang) =>
  new Intl.DateTimeFormat(lang === "es" ? "es-PR" : "en-US", {
    timeZone: "America/Puerto_Rico",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);

export const formatRelative = (date: Date, now: Date, lang: Lang) => {
  const diffSec = Math.round((date.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat(lang === "es" ? "es" : "en", {
    numeric: "auto",
  });
  if (abs < 60) return rtf.format(Math.trunc(diffSec / 1), "second");
  if (abs < 3600) return rtf.format(Math.trunc(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.trunc(diffSec / 3600), "hour");
  return rtf.format(Math.trunc(diffSec / 86400), "day");
};

/** Data older than this is flagged as stale in the UI. */
export const STALE_AFTER_MS = 30 * 60 * 1000;

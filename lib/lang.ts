export type Lang = "es" | "en";

export const LANG_COOKIE = "lang";

export const isLang = (value: unknown): value is Lang =>
  value === "es" || value === "en";

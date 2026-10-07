/** Shared by the alerts UI and server. */
export const ALERT_THRESHOLDS = [1, 5, 10, 20, 50] as const;
export type AlertThreshold = (typeof ALERT_THRESHOLDS)[number];

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/** An "above threshold" alert clears once the share drops below this fraction of it. */
export const RECOVERY_RATIO = 0.8;

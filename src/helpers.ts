import type { HomeAssistantLike, ServiceActionConfig } from "./types";

export function getDomain(entityId: string): string {
  const idx = entityId.indexOf(".");
  return idx === -1 ? "" : entityId.slice(0, idx);
}

export function isEntityOn(state?: string): boolean {
  return state === "on";
}

export function formatRemaining(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export async function callConfiguredService(
  hass: HomeAssistantLike,
  action: ServiceActionConfig
): Promise<void> {
  const [domain, service] = action.service.split(".");
  if (!domain || !service) {
    throw new Error(`Invalid service: ${action.service}`);
  }
  await hass.callService(domain, service, action.data, action.target);
}

const STORAGE_PREFIX = "rachio-irrigation-card";

function timerKey(entityId: string, field: "start" | "duration"): string {
  return `${STORAGE_PREFIX}:${entityId}:${field}`;
}

export function saveTimerStart(
  entityId: string,
  durationMinutes: number
): void {
  try {
    localStorage.setItem(timerKey(entityId, "start"), String(Date.now()));
    localStorage.setItem(
      timerKey(entityId, "duration"),
      String(durationMinutes * 60)
    );
  } catch {
    // localStorage may be unavailable (private mode, quota). Fail silent.
  }
}

export function clearTimer(entityId: string): void {
  try {
    localStorage.removeItem(timerKey(entityId, "start"));
    localStorage.removeItem(timerKey(entityId, "duration"));
  } catch {
    // ignore
  }
}

export function loadRemainingSeconds(entityId: string): number {
  try {
    const startStr = localStorage.getItem(timerKey(entityId, "start"));
    const durStr = localStorage.getItem(timerKey(entityId, "duration"));
    if (!startStr || !durStr) return 0;
    const start = Number(startStr);
    const duration = Number(durStr);
    if (!Number.isFinite(start) || !Number.isFinite(duration)) return 0;
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const remaining = duration - elapsed;
    if (remaining <= 0) {
      clearTimer(entityId);
      return 0;
    }
    return remaining;
  } catch {
    return 0;
  }
}

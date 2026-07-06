import { describe, it, expect, beforeEach } from "vitest";
import {
  getDomain,
  isEntityOn,
  formatRemaining,
  callConfiguredService,
  saveTimerStart,
  clearTimer,
  loadRemainingSeconds,
} from "./helpers";
import type { HomeAssistantLike } from "./types";

// Minimal localStorage mock for node environment
function makeLocalStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  };
}

beforeEach(() => {
  (globalThis as unknown as { localStorage: Storage }).localStorage =
    makeLocalStorage() as unknown as Storage;
});

describe("getDomain", () => {
  it("extracts the domain from an entity id", () => {
    expect(getDomain("switch.rachio_zone_1")).toBe("switch");
    expect(getDomain("input_boolean.rachio_standby")).toBe("input_boolean");
  });
  it("returns empty string for malformed ids", () => {
    expect(getDomain("no_domain_here")).toBe("");
    expect(getDomain("")).toBe("");
  });
});

describe("isEntityOn", () => {
  it("is true only for 'on'", () => {
    expect(isEntityOn("on")).toBe(true);
    expect(isEntityOn("off")).toBe(false);
    expect(isEntityOn(undefined)).toBe(false);
    expect(isEntityOn("unavailable")).toBe(false);
  });
});

describe("formatRemaining", () => {
  it("formats seconds as m:ss", () => {
    expect(formatRemaining(0)).toBe("0:00");
    expect(formatRemaining(9)).toBe("0:09");
    expect(formatRemaining(65)).toBe("1:05");
    expect(formatRemaining(600)).toBe("10:00");
  });
  it("clamps negative values to 0", () => {
    expect(formatRemaining(-5)).toBe("0:00");
  });
});

describe("callConfiguredService", () => {
  function makeHass(): HomeAssistantLike {
    return {
      states: {},
      callService: async () => {},
    };
  }

  it("splits domain.service and forwards to callService", async () => {
    const calls: Array<[string, string, unknown]> = [];
    const hass: HomeAssistantLike = {
      states: {},
      callService: async (domain, service, data, target) => {
        calls.push([domain, service, { data, target }]);
      },
    };
    await callConfiguredService(hass, {
      service: "switch.turn_on",
      data: { entity_id: "switch.zone_1" },
      target: { entity_id: "switch.zone_1" },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0][0]).toBe("switch");
    expect(calls[0][1]).toBe("turn_on");
  });

  it("throws on invalid service string", async () => {
    await expect(
      callConfiguredService(makeHass(), { service: "not_valid" })
    ).rejects.toThrow("Invalid service: not_valid");
  });
});

describe("localStorage timer helpers", () => {
  const entityId = "input_boolean.test_timer";

  it("round-trips a saved timer", () => {
    clearTimer(entityId);
    saveTimerStart(entityId, 1);
    const remaining = loadRemainingSeconds(entityId);
    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(60);
    clearTimer(entityId);
  });

  it("returns 0 for an entity with no saved timer", () => {
    clearTimer(entityId);
    expect(loadRemainingSeconds(entityId)).toBe(0);
  });

  it("clearTimer removes the entry", () => {
    saveTimerStart(entityId, 5);
    clearTimer(entityId);
    expect(loadRemainingSeconds(entityId)).toBe(0);
  });
});

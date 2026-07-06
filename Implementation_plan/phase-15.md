Phase 15: Add testing
Goal

Catch logic bugs before installing in Home Assistant. Lands incrementally
from v0.1.0 (helper unit tests) onward.

Recommended test types

1. TypeScript checks — already wired (`npm run typecheck`).
2. Helper unit tests — vitest, no DOM needed.
3. Mocked-hass interaction tests — vitest + a fake `hass` object.
4. Browser/manual tests — local Home Assistant (Phase 5).

Setup

```sh
npm install -D vitest
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Add `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

Helper unit tests

File: `src/helpers.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { getDomain, isEntityOn, formatRemaining } from "./helpers";

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
```

Mocked-hass interaction tests

File: `src/rachio-irrigation-card.test.ts`

```ts
import { describe, it, expect, vi } from "vitest";
import type { HomeAssistantLike } from "./types";

function makeHass(states: Record<string, { state: string; attributes?: any }> = {}): HomeAssistantLike {
  const callService = vi.fn().mockResolvedValue(undefined);
  const hass: HomeAssistantLike = {
    states: Object.fromEntries(
      Object.entries(states).map(([id, s]) => [
        id,
        { entity_id: id, state: s.state, attributes: s.attributes ?? {} },
      ])
    ),
    callService,
  };
  return hass;
}

// Minimal card harness: create the element, set hass+config, click.
// Full DOM tests need @happy-dom/jsdom or jsdom environment in vitest.
// For v0.1.0 keep helper + service-call signature tests in node env.

describe("card service-call contract", () => {
  it("calls turn_on for an off zone (signature only)", async () => {
    const hass = makeHass({
      "input_boolean.rachio_zone_1": { state: "off" },
    });
    await hass.callService("input_boolean", "turn_on", {
      entity_id: "input_boolean.rachio_zone_1",
    });
    expect(hass.callService).toHaveBeenCalledWith(
      "input_boolean", "turn_on", { entity_id: "input_boolean.rachio_zone_1" }
    );
  });
});
```

Test checklist

- [ ] `getDomain()` extracts domain correctly
- [ ] `isEntityOn()` only true for "on"
- [ ] `formatRemaining()` formats and clamps correctly
- [ ] Clicking off zone calls `domain.turn_on`
- [ ] Clicking on zone calls `domain.turn_off`
- [ ] Stop calls `turn_off` for all zones
- [ ] Missing entity renders warning (DOM test — needs jsdom env)

For v0.2.0+, switch the vitest environment to `jsdom` or `happy-dom`
to test rendering and click events on the actual Lit element.

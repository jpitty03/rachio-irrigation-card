Phase 9: Add card validation and error handling
Goal

Make the card friendly when users misconfigure it. Two layers:

1. Fatal validation in `setConfig` — wrong shape, throws so HA shows
   the standard "invalid config" error card.
2. Soft validation at render time — missing entities, bad service
   strings — rendered inline as warnings, never thrown.

Validation checklist

- [ ] `zones` is present and an array (fatal — already in Phase 4)
- [ ] `zones` is non-empty (fatal — already in Phase 4)
- [ ] each zone has an `entity` string (fatal)
- [ ] each `duration` (if provided) is a positive number (fatal)
- [ ] `default_duration` (if provided) is a positive number (fatal)
- [ ] `tap_action.service` (if provided) matches `domain.service` (fatal)
- [ ] `stop_action.service` (if provided) matches `domain.service` (fatal)
- [ ] rain_delay_entity / standby_entity exist in `hass.states` (soft)
- [ ] each zone.entity exists in `hass.states` (soft, rendered disabled)

`setConfig` validation

```ts
import type { ServiceActionConfig } from "./types";

const SERVICE_RE = /^[a-z_]+\.[a-z_0-9]+$/i;

function validateService(action: ServiceActionConfig | undefined, ctx: string) {
  if (!action) return;
  if (!action.service || !SERVICE_RE.test(action.service)) {
    throw new Error(
      `Rachio Irrigation Card: ${ctx} has invalid service "${action.service}". ` +
      `Expected "domain.service" (e.g. "switch.turn_on").`
    );
  }
}

setConfig(config: RachioIrrigationCardConfig) {
  if (!config || typeof config !== "object") {
    throw new Error("Rachio Irrigation Card: config is not an object.");
  }
  if (!Array.isArray(config.zones)) {
    throw new Error("Rachio Irrigation Card requires a zones array.");
  }
  if (config.zones.length === 0) {
    throw new Error("Rachio Irrigation Card requires at least one zone.");
  }

  for (const [i, zone] of config.zones.entries()) {
    if (!zone.entity || typeof zone.entity !== "string") {
      throw new Error(
        `Rachio Irrigation Card: zone[${i}] is missing a string "entity".`
      );
    }
    if (zone.duration !== undefined) {
      if (typeof zone.duration !== "number" || zone.duration <= 0) {
        throw new Error(
          `Rachio Irrigation Card: zone[${i}].duration must be a positive number.`
        );
      }
    }
    validateService(zone.tap_action, `zone[${i}].tap_action`);
  }

  if (config.default_duration !== undefined) {
    if (
      typeof config.default_duration !== "number" ||
      config.default_duration <= 0
    ) {
      throw new Error(
        `Rachio Irrigation Card: default_duration must be a positive number.`
      );
    }
  }

  validateService(config.stop_action, "stop_action");

  this.config = {
    title: "Irrigation Quick Run",
    default_duration: 10,
    show_timer: true,
    ...config,
  };
}
```

Render-time soft warnings

Render a missing-entity zone as a disabled button with a visible
"Missing entity" label (already in Phase 4). Add an optional header
warning when globally-configured entities are missing:

```ts
private renderWarnings(): unknown {
  if (!this.hass) return nothing;
  const missing: string[] = [];
  if (this.config.rain_delay_entity && !this.getEntityState(this.config.rain_delay_entity)) {
    missing.push(this.config.rain_delay_entity);
  }
  if (this.config.standby_entity && !this.getEntityState(this.config.standby_entity)) {
    missing.push(this.config.standby_entity);
  }
  if (missing.length === 0) return nothing;
  return html`
    <div class="warnings">
      ${missing.map(
        (e) =>
          html`<div class="warning">Missing entity: <code>${e}</code></div>`
      )}
    </div>
  `;
}
```

Add to `render()` between header and zones. Add CSS:

```ts
.warnings {
  margin-bottom: 8px;
}
.warning {
  font-size: 12px;
  color: var(--error-color, #db4437);
  padding: 4px 6px;
  border: 1px solid var(--error-color, #db4437);
  border-radius: 6px;
  margin-bottom: 4px;
}
.warning code {
  font-family: var(--code-font-family, monospace);
}
```

Rules

- `setConfig` runs once at card creation and on config edits. Throws
  surface as HA's standard error card with the message — good UX.
- Render-time checks run every state change. Never throw from
  `render()`; always degrade gracefully.
- The per-zone "Missing entity" state (Phase 4) stays as-is.

Out of scope

- Cross-zone duplicate entity detection (low value, noisy).
- Schema validation against a JSON Schema file (overkill for v0.2.0).

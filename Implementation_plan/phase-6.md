Phase 6: Improve the service model
Goal

Support both generic on/off entities and integration-specific service
calls, so Rachio users can wire in `rachio.stop_watering` and similar
without the card hardcoding Rachio assumptions.

Background

The v0.1.0 card (Phase 4) calls:

```ts
hass.callService(domain, "turn_on", { entity_id: entityId });
```

That works for:
- `input_boolean.*`
- `switch.*`
- Most generic on/off entities

But Rachio (and other integrations) expose specialized services, e.g.:
- `rachio.stop_watering`
- `rachio.set_zone_state` (with duration + zone id)
- Rain delay may need a service call rather than a switch toggle

This phase adds an optional `tap_action` / `stop_action` config layer
that lets users override the default behavior per-zone or globally,
without forcing the card to know about Rachio internals.

New config (additive — fully optional)

```yaml
type: custom:rachio-irrigation-card
title: Irrigation Quick Run
zones:
  - name: Zone 1
    entity: switch.rachio_zone_1
    duration: 10
    tap_action:
      service: switch.turn_on
      data:
        entity_id: switch.rachio_zone_1
stop_action:
  service: rachio.stop_watering
```

If `tap_action` is omitted, the card falls back to the default
`turn_on`/`turn_off` toggle (Phase 4 behavior). If `stop_action` is
omitted, Stop Watering loops `turn_off` over all zones (Phase 4).

New types (added to `src/types.ts`)

```ts
export interface ServiceActionConfig {
  service: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
}

export interface IrrigationZoneConfig {
  name?: string;
  entity: string;
  duration?: number;
  icon?: string;
  tap_action?: ServiceActionConfig;
}

export interface RachioIrrigationCardConfig {
  type: string;
  title?: string;
  zones: IrrigationZoneConfig[];
  rain_delay_entity?: string;
  standby_entity?: string;
  show_timer?: boolean;
  default_duration?: number;
  stop_action?: ServiceActionConfig;
}
```

New helper (added to `src/helpers.ts`)

```ts
import type { HomeAssistantLike, ServiceActionConfig } from "./types";

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
```

Card changes (`src/rachio-irrigation-card.ts`)

`toggleZone` becomes:

```ts
private async toggleZone(zone: IrrigationZoneConfig) {
  if (!this.hass) return;
  const entity = this.getEntityState(zone.entity);
  const currentlyOn = isEntityOn(entity?.state);

  if (zone.tap_action) {
    await callConfiguredService(this.hass, zone.tap_action);
  } else {
    await this.toggleEntity(zone.entity);
  }

  // Timer logic unchanged from Phase 4.
  if (!currentlyOn) {
    const durationMinutes =
      zone.duration ?? this.config.default_duration ?? 10;
    this.timers = { ...this.timers, [zone.entity]: durationMinutes * 60 };
  } else {
    const nextTimers = { ...this.timers };
    delete nextTimers[zone.entity];
    this.timers = nextTimers;
  }
}
```

`stopAll` becomes:

```ts
private async stopAll() {
  if (!this.hass) return;
  if (this.config.stop_action) {
    await callConfiguredService(this.hass, this.config.stop_action);
  } else {
    for (const zone of this.config.zones) {
      const domain = getDomain(zone.entity);
      await this.hass.callService(domain, "turn_off", {
        entity_id: zone.entity,
      });
    }
  }
  this.timers = {};
}
```

Validation (Phase 9 will formalize, but Phase 6 enforces):

- `action.service` must contain a `domain.service` string.
- Invalid service string throws synchronously before any call is made.
- `tap_action` with no `service` key is treated as no-op (logged).

Why this design

- Default behavior unchanged: users who don't set `tap_action` /
  `stop_action` get the Phase 4 generic toggle. No breaking change.
- Rachio users get a clean escape hatch: point `stop_action` at
  `rachio.stop_watering` and the card calls the right service.
- The card never imports or knows about Rachio's service catalog.
  Compatibility is config-driven, not code-driven.

Versioning

This lands in v0.2.0 per the Phase 18 roadmap. v0.1.0 ships with
the generic toggle only.

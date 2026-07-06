Phase 2: Define the first card API
Goal

Design the YAML config first so the code has a clear target.

This is a design-only phase. No code is written here.
Phase 4 implements against this exact schema.

Card identity
- Custom element name: `rachio-irrigation-card`
- Lovelace type: `custom:rachio-irrigation-card`
- Repo name: `rachio-irrigation-card`

These three names are intentionally aligned to avoid HACS/Lovelace confusion.

First supported config (v0.1.0 MVP)

```yaml
type: custom:rachio-irrigation-card
title: Irrigation Quick Run
default_duration: 10
show_timer: true
zones:
  - name: Zone 1
    entity: input_boolean.rachio_zone_1
    duration: 10
    icon: mdi:sprinkler
  - name: Zone 2
    entity: input_boolean.rachio_zone_2
    duration: 10
  - name: Zone 3
    entity: input_boolean.rachio_zone_3
    duration: 10
  - name: Zone 4
    entity: input_boolean.rachio_zone_4
    duration: 10
rain_delay_entity: input_boolean.rachio_rain_delay
standby_entity: input_boolean.rachio_standby
```

Config schema (v0.1.0)

Top-level fields:

| Field                | Type     | Required | Default                | Description                                          |
| -------------------- | -------- | -------- | ---------------------- | ---------------------------------------------------- |
| `type`               | string   | yes      | -                      | Must be `custom:rachio-irrigation-card`.             |
| `title`              | string   | no       | `"Irrigation Quick Run"` | Card header text.                                  |
| `zones`              | array    | yes      | -                      | List of zone controls. Cannot be empty.              |
| `default_duration`   | number   | no       | `10`                   | Minutes used when a zone omits `duration`.           |
| `show_timer`         | boolean  | no       | `true`                 | Show the local countdown timer on running zones.     |
| `rain_delay_entity`  | string   | no       | -                      | Entity toggled by the Rain Delay button.             |
| `standby_entity`     | string   | no       | -                      | Entity toggled by the Standby button.                |

Per-zone fields:

| Field     | Type   | Required | Default                              | Description                                         |
| --------- | ------ | -------- | ------------------------------------ | -------------------------------------------------- |
| `entity`  | string | yes      | -                                    | Any on/off HA entity (switch.*, input_boolean.*). |
| `name`    | string | no       | entity `friendly_name` or `entity`   | Display label for the zone button.                 |
| `duration`| number | no       | top-level `default_duration` or `10` | Run duration in minutes for the local timer.      |
| `icon`    | string | no       | -                                    | Optional `mdi:` icon (rendered in v0.2.0+).        |

Fields deliberately excluded from v0.1.0

These are documented in later phases and added incrementally:
- `layout` (columns, compact) — Phase 8
- `stop_action` / `tap_action` — Phase 6
- `timer_entity` — Phase 7 (optional, v0.2.0)

Initial card behavior (v0.1.0 MVP)

Each zone button:
1. Shows zone name (zone.name → entity friendly_name → entity_id).
2. Shows current entity state ("Running" / "Off" / "Missing entity").
3. On tap: calls `turn_on` if off, `turn_off` if on (domain derived from entity_id).
4. On turn-on: starts a local visual countdown timer = `duration` minutes.
5. On turn-off: stops/resets that zone's timer.
6. When `show_timer` is false: timer logic still runs internally but is not rendered.

Action buttons (rendered only if the corresponding entity is configured):
- **Rain Delay** — toggles `rain_delay_entity`.
- **Standby** — toggles `standby_entity`.
- **Stop Watering** — always rendered; calls `turn_off` for every zone and clears all timers.

Error/edge handling (full validation arrives in Phase 9, but MVP must not crash):
- Missing `zones` array → throw from `setConfig` (fatal, shows HA error card).
- Missing entity in `states` → render the zone button disabled with "Missing entity".
- Unknown entity domain → still attempt `turn_on`/`turn_off` (HA returns the error).

Why use input_boolean locally?

The real Rachio integration exposes sprinkler controls as HA entities, but
the card only needs to know that an entity has an on/off state and can
receive `turn_on` / `turn_off` service calls. Using `input_boolean` lets
you develop and test the card without Rachio hardware.

Compatibility stance

This card does NOT require the Rachio integration. It works with any
on/off Home Assistant entity. Rachio is the design inspiration and the
primary documented example, not a hard dependency.

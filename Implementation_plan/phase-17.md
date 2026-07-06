Phase 17: Add advanced Rachio-style features
Goal

Make the card feel purpose-built for Rachio without losing its
generic-entity foundation. Most of these land across v0.2.0–v0.3.0.

Possible features

- Per-zone quick run duration (already in v0.1.0 via `zone.duration`)
- Visual countdown timer (v0.1.0)
- Connection/status icon (v0.1.0 — currently a static `●`)
- Rain delay button (v0.1.0)
- Standby button (v0.1.0)
- Stop watering button (v0.1.0)
- Zone icons (v0.2.0 — field accepted in v0.1.0, rendered later)
- Compact mode (v0.2.0 — Phase 8)
- 2-column / 3-column layout (v0.2.0 — Phase 8)
- Optional confirmation before Stop Watering (v0.2.0)
- Disabled state when standby is on (v0.2.0)
- Custom service actions (v0.2.0 — Phase 6)
- localStorage timer persistence (v0.2.0 — Phase 7)
- Visual editor (v0.3.0 — Phase 10)

Confirmation before Stop Watering (v0.2.0)

```yaml
confirm_stop: true
```

When set, the Stop Watering button shows a confirmation dialog before
firing. Implementation uses HA's `showConfirmation` dialog via the
`hass` object if available, falling back to a native `confirm()`.

Disabled state when standby is on (v0.2.0)

If `standby_entity` is `on`, zone buttons render disabled with a
"Standby" badge. The Rain Delay and Standby buttons stay enabled.

Example advanced config (target v0.2.0)

```yaml
type: custom:rachio-irrigation-card
title: Irrigation Quick Run
default_duration: 10
show_timer: true
confirm_stop: true
layout:
  columns: 2
  compact: true
zones:
  - name: Front Lawn
    entity: switch.rachio_front_lawn
    duration: 10
    icon: mdi:sprinkler
  - name: Side Yard
    entity: switch.rachio_side_yard
    duration: 10
    icon: mdi:sprinkler
rain_delay_entity: switch.rachio_rain_delay
standby_entity: switch.rachio_standby
stop_action:
  service: rachio.stop_watering
```

Scope guard

Do not implement Rachio's REST API, OAuth, or device discovery in
the card. The card talks to HA entities only. If Rachio exposes a
feature only via its API (not via HA entities), it is out of scope.

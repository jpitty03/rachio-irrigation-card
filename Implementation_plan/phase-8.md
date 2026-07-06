Phase 8: Add layout and styling options
Goal

Make the card layout configurable without overbuilding it. Lands in
v0.2.0 per the Phase 18 roadmap.

Suggested config

```yaml
type: custom:rachio-irrigation-card
title: Irrigation Quick Run
default_duration: 10
show_timer: true
layout:
  columns: 2
  compact: true
  show_status: true
zones:
  - name: Front Lawn
    entity: switch.rachio_front_lawn
    duration: 10
    icon: mdi:sprinkler
rain_delay_entity: switch.rachio_rain_delay
standby_entity: switch.rachio_standby
```

Types (added to `src/types.ts`)

```ts
export interface LayoutConfig {
  columns?: number;     // default 2
  compact?: boolean;   // default false
  show_status?: boolean; // default true
  show_timer?: boolean; // overrides top-level show_timer if set
}

export interface RachioIrrigationCardConfig {
  type: string;
  title?: string;
  zones: IrrigationZoneConfig[];
  rain_delay_entity?: string;
  standby_entity?: string;
  show_timer?: boolean;
  default_duration?: number;
  layout?: LayoutConfig;
}
```

Target layouts

Default (2 columns, non-compact):

```
Irrigation Quick Run   ●

[ Zone 1 info ] [ Zone 2 info ]
[ Zone 3 info ] [ Zone 4 info ]

[ Rain Delay ] [ Standby ]
[      Stop Watering      ]
```

3-column compact (status + timer inline, tighter padding):

```
Irrigation ●

[Z1][Z2][Z3]
[Z4]

[Rain][Stdby][Stop]
```

CSS variable approach

Use a CSS custom property so the grid columns are driven from
config without injecting inline stylesheets:

```ts
// src/styles.ts (additions)
export const cardStyles = css`
  .zones {
    display: grid;
    grid-template-columns: repeat(var(--zone-columns, 2), minmax(0, 1fr));
    gap: var(--zone-gap, 8px);
  }
  .card.compact { padding: 6px; }
  .card.compact .zone { min-height: 32px; padding: 4px 6px; }
  .card.compact .zone-status { display: none; }
  .card:not(.compact) .zone-status { font-size: 12px; opacity: 0.75; }
  .actions {
    grid-template-columns: repeat(var(--action-columns, 2), minmax(0, 1fr));
  }
`;
```

In `render()`, set the variable via `style`:

```ts
private renderLayoutVars() {
  const cols = this.config.layout?.columns ?? 2;
  return `--zone-columns: ${cols};`;
}

// in render():
return html`
  <ha-card>
    <div
      class=${this.config.layout?.compact ? "card compact" : "card"}
      style=${this.renderLayoutVars()}
    >
      ...
    </div>
  </ha-card>
`;
```

For the action row, when `columns >= 3` bump action-columns to match
so Stop Watering spans full width cleanly:

```ts
private renderLayoutVars() {
  const cols = this.config.layout?.columns ?? 2;
  const actionCols = cols >= 3 ? cols : 2;
  return `--zone-columns: ${cols}; --action-columns: ${actionCols};`;
}
```

Behavior rules

- `columns` clamped to `[1, 6]`. Values outside that range fall back
  to 2 with a console warning.
- `compact: true` hides the status line and tightens padding.
- `show_status: false` hides the "Running/Off" text regardless of
  compact mode (the active highlight still shows state).
- `show_timer` resolution order: `layout.show_timer` → top-level
  `show_timer` → default `true`.

Out of scope for v0.2.0

- Per-zone column spans (a zone spanning 2 columns).
- Responsive breakpoints (card auto-collapsing to 1 column on narrow
  views). HA's masonry layout handles the card width; the card itself
  stays at the configured column count.

These are candidates for v0.3.0 if requested.

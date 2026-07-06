Phase 4: Implement the first working card
Goal

Render the basic UI and control fake zone entities, targeting the
schema defined in Phase 2.

This is the first real code phase. Files: `src/types.ts`,
`src/helpers.ts`, `src/rachio-irrigation-card.ts` (and `src/styles.ts`
for the CSS, separated per Phase 1 structure).

src/types.ts

```ts
import type { LovelaceCard, LovelaceCardEditor } from "custom-card-helpers";

export interface IrrigationZoneConfig {
  name?: string;
  entity: string;
  duration?: number;
  icon?: string;
}

export interface RachioIrrigationCardConfig {
  type: string;
  title?: string;
  zones: IrrigationZoneConfig[];
  rain_delay_entity?: string;
  standby_entity?: string;
  show_timer?: boolean;
  default_duration?: number;
}

export interface HomeAssistantEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    [key: string]: unknown;
  };
}

export interface HomeAssistantLike {
  states: Record<string, HomeAssistantEntity>;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>
  ) => Promise<void>;
}
```

src/helpers.ts

```ts
export function getDomain(entityId: string): string {
  return entityId.split(".")[0] || "";
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
```

src/rachio-irrigation-card.ts

```ts
import { LitElement, html, css, nothing } from "lit";
import type {
  HomeAssistantLike,
  IrrigationZoneConfig,
  RachioIrrigationCardConfig,
} from "./types";
import { formatRemaining, getDomain, isEntityOn } from "./helpers";
import { cardStyles } from "./styles";

class RachioIrrigationCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { state: true },
    timers: { state: true },
  };

  hass?: HomeAssistantLike;
  config!: RachioIrrigationCardConfig;
  timers: Record<string, number> = {};

  private intervalId?: number;

  setConfig(config: RachioIrrigationCardConfig) {
    if (!config.zones || !Array.isArray(config.zones)) {
      throw new Error("Rachio Irrigation Card requires a zones array.");
    }
    if (config.zones.length === 0) {
      throw new Error("Rachio Irrigation Card requires at least one zone.");
    }

    this.config = {
      title: "Irrigation Quick Run",
      default_duration: 10,
      show_timer: true,
      ...config,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.intervalId = window.setInterval(() => {
      // Only re-render if at least one timer is running (avoids needless updates).
      const hasActive = Object.values(this.timers).some((s) => s > 0);
      if (!hasActive) return;

      const nextTimers: Record<string, number> = {};
      for (const [entityId, seconds] of Object.entries(this.timers)) {
        if (seconds > 0) {
          nextTimers[entityId] = seconds - 1;
        }
      }
      this.timers = nextTimers;
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return {
      rows: 3,
      columns: 6,
      min_rows: 2,
      min_columns: 6,
    };
  }

  private getEntityState(entityId: string) {
    return this.hass?.states?.[entityId];
  }

  private async toggleEntity(entityId: string) {
    if (!this.hass) return;
    const entity = this.getEntityState(entityId);
    const domain = getDomain(entityId);
    const service = isEntityOn(entity?.state) ? "turn_off" : "turn_on";
    await this.hass.callService(domain, service, { entity_id: entityId });
  }

  private async toggleZone(zone: IrrigationZoneConfig) {
    if (!this.hass) return;
    const entity = this.getEntityState(zone.entity);
    const currentlyOn = isEntityOn(entity?.state);

    await this.toggleEntity(zone.entity);

    if (!currentlyOn) {
      const durationMinutes =
        zone.duration ?? this.config.default_duration ?? 10;
      this.timers = {
        ...this.timers,
        [zone.entity]: durationMinutes * 60,
      };
    } else {
      const nextTimers = { ...this.timers };
      delete nextTimers[zone.entity];
      this.timers = nextTimers;
    }
  }

  private async stopAll() {
    if (!this.hass) return;
    for (const zone of this.config.zones) {
      const domain = getDomain(zone.entity);
      await this.hass.callService(domain, "turn_off", {
        entity_id: zone.entity,
      });
    }
    this.timers = {};
  }

  private renderZone(zone: IrrigationZoneConfig) {
    const entity = this.getEntityState(zone.entity);
    const missing = !entity;
    const active = isEntityOn(entity?.state);
    const label = zone.name || entity?.attributes?.friendly_name || zone.entity;
    const remaining = this.timers[zone.entity];

    return html`
      <button
        class=${active ? "zone active" : "zone"}
        ?disabled=${missing}
        @click=${() => this.toggleZone(zone)}
      >
        <span class="zone-name">${label}</span>
        <span class="zone-status">
          ${missing ? "Missing entity" : active ? "Running" : "Off"}
        </span>
        ${this.config.show_timer && remaining
          ? html`<span class="timer">${formatRemaining(remaining)}</span>`
          : nothing}
      </button>
    `;
  }

  render() {
    if (!this.config) return nothing;
    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <div class="title">${this.config.title}</div>
            <div class="connection">●</div>
          </div>
          <div class="zones">
            ${this.config.zones.map((zone) => this.renderZone(zone))}
          </div>
          <div class="actions">
            ${this.config.rain_delay_entity
              ? html`<button
                  class="action"
                  @click=${() => this.toggleEntity(this.config.rain_delay_entity!)}
                >Rain Delay</button>`
              : nothing}
            ${this.config.standby_entity
              ? html`<button
                  class="action"
                  @click=${() => this.toggleEntity(this.config.standby_entity!)}
                >Standby</button>`
              : nothing}
            <button class="action stop" @click=${this.stopAll}>
              Stop Watering
            </button>
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = [cardStyles];
}

customElements.define("rachio-irrigation-card", RachioIrrigationCard);

declare global {
  interface HTMLElementTagNameMap {
    "rachio-irrigation-card": RachioIrrigationCard;
  }
}
```

src/styles.ts

```ts
import { css } from "lit";

export const cardStyles = css`
  .card { padding: 12px; }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .title { font-size: 16px; font-weight: 600; }
  .connection { color: var(--success-color, var(--primary-color)); }
  .zones {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  .zone, .action {
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
    min-height: 42px;
    padding: 7px 9px;
    font: inherit;
  }
  .zone {
    text-align: left;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: "name timer" "status timer";
    align-items: center;
    gap: 1px 8px;
  }
  .zone:disabled { opacity: 0.55; cursor: not-allowed; }
  .zone.active {
    background: var(--primary-color);
    color: var(--text-primary-color);
    border-color: var(--primary-color);
  }
  .zone-name {
    grid-area: name;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .zone-status { grid-area: status; font-size: 12px; opacity: 0.75; }
  .timer {
    grid-area: timer;
    font-variant-numeric: tabular-nums;
    font-size: 13px;
    opacity: 0.9;
  }
  .actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 8px;
  }
  .stop { grid-column: 1 / -1; }
`;
```

Notes / gaps closed vs. original phase-4.md

1. Added `zones.length === 0` validation in `setConfig` (Phase 2 contract).
2. The per-second `setInterval` now early-returns when no timers are
   active, avoiding needless re-renders and CPU churn when the card
   is idle.
3. `intervalId` is explicitly cleared to `undefined` in
   `disconnectedCallback` to guard against double-disconnect.
4. Styles split into `src/styles.ts` per the Phase 1 file structure
   (original inline `static styles` worked but the plan listed a
   separate `styles.ts`).
5. Removed the unused `LovelaceCard`/`LovelaceCardEditor` imports from
   the snippet above (kept only the interface types actually used by
   v0.1.0). The `custom-card-helpers` dependency is NOT required for
   v0.1.0 and is deferred to Phase 10 (visual editor).

Verification before moving on

```
npm run typecheck   # must pass
npm run build      # must produce dist/rachio-irrigation-card.js
```

The card is not yet testable in HA until Phase 5 (manual resource load).

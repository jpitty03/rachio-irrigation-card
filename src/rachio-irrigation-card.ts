import { LitElement, html, css, nothing } from "lit";
import type {
  HomeAssistantLike,
  IrrigationZoneConfig,
  RachioIrrigationCardConfig,
  ServiceActionConfig,
} from "./types";
import { formatRemaining, getDomain, isEntityOn, callConfiguredService, saveTimerStart, clearTimer, loadRemainingSeconds } from "./helpers";
import { cardStyles } from "./styles";

const SERVICE_RE = /^[a-z_]+\.[a-z_0-9]+$/i;

function validateService(
  action: ServiceActionConfig | undefined,
  ctx: string
): void {
  if (!action) return;
  if (!action.service || !SERVICE_RE.test(action.service)) {
    throw new Error(
      `Rachio Irrigation Card: ${ctx} has invalid service "${action.service}". ` +
        `Expected "domain.service" (e.g. "switch.turn_on").`
    );
  }
}

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
          "Rachio Irrigation Card: default_duration must be a positive number."
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

  connectedCallback() {
    super.connectedCallback();
    this.hydrateTimers();
    this.intervalId = window.setInterval(() => {
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

  private hydrateTimers() {
    if (!this.config) return;
    const nextTimers: Record<string, number> = {};
    for (const zone of this.config.zones) {
      const remaining = loadRemainingSeconds(zone.entity);
      if (remaining > 0) {
        nextTimers[zone.entity] = remaining;
      }
    }
    if (Object.keys(nextTimers).length > 0) {
      this.timers = nextTimers;
    }
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

  static getStubConfig(): Partial<RachioIrrigationCardConfig> {
    return {
      title: "Irrigation Quick Run",
      zones: [
        {
          name: "Zone 1",
          entity: "switch.zone_1",
          duration: 10,
        },
      ],
    };
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./editor");
    return document.createElement("rachio-irrigation-card-editor");
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

    if (zone.tap_action) {
      await callConfiguredService(this.hass, zone.tap_action);
    } else {
      await this.toggleEntity(zone.entity);
    }

    if (!currentlyOn) {
      const durationMinutes =
        zone.duration ?? this.config.default_duration ?? 10;
      this.timers = {
        ...this.timers,
        [zone.entity]: durationMinutes * 60,
      };
      saveTimerStart(zone.entity, durationMinutes);
    } else {
      const nextTimers = { ...this.timers };
      delete nextTimers[zone.entity];
      this.timers = nextTimers;
      clearTimer(zone.entity);
    }
  }

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
    for (const zone of this.config.zones) {
      clearTimer(zone.entity);
    }
    this.timers = {};
  }

  private get showTimer(): boolean {
    const fromLayout = this.config.layout?.show_timer;
    if (fromLayout !== undefined) return fromLayout;
    return this.config.show_timer ?? true;
  }

  private get showStatus(): boolean {
    return this.config.layout?.show_status ?? true;
  }

  private get columnCount(): number {
    const cols = this.config.layout?.columns ?? 2;
    if (cols < 1 || cols > 6) {
      console.warn(
        `Rachio Irrigation Card: layout.columns ${cols} out of range [1,6]; falling back to 2.`
      );
      return 2;
    }
    return cols;
  }

  private renderLayoutVars(): string {
    const cols = this.columnCount;
    const actionCols = cols >= 3 ? cols : 2;
    return `--zone-columns: ${cols}; --action-columns: ${actionCols};`;
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
        ${this.showStatus
          ? html`<span class="zone-status">
              ${missing ? "Missing entity" : active ? "Running" : "Off"}
            </span>`
          : nothing}
        ${this.showTimer && remaining
          ? html`<span class="timer">${formatRemaining(remaining)}</span>`
          : nothing}
      </button>
    `;
  }

  private renderWarnings(): unknown {
    if (!this.hass) return nothing;
    const missing: string[] = [];
    if (
      this.config.rain_delay_entity &&
      !this.getEntityState(this.config.rain_delay_entity)
    ) {
      missing.push(this.config.rain_delay_entity);
    }
    if (
      this.config.standby_entity &&
      !this.getEntityState(this.config.standby_entity)
    ) {
      missing.push(this.config.standby_entity);
    }
    if (missing.length === 0) return nothing;
    return html`
      <div class="warnings">
        ${missing.map(
          (e) =>
            html`<div class="warning">
              Missing entity: <code>${e}</code>
            </div>`
        )}
      </div>
    `;
  }

  render() {
    if (!this.config) return nothing;
    return html`
      <ha-card>
        <div
          class=${this.config.layout?.compact ? "card compact" : "card"}
          style=${this.renderLayoutVars()}
        >
          <div class="header">
            <div class="title">${this.config.title}</div>
            <div class="connection">●</div>
          </div>
          ${this.renderWarnings()}
          <div class="zones">
            ${this.config.zones.map((zone) => this.renderZone(zone))}
          </div>
          <div class="actions">
            ${this.config.rain_delay_entity
              ? html`
                  <button
                    class="action"
                    @click=${() => this.toggleEntity(this.config.rain_delay_entity!)}
                  >
                    Rain Delay
                  </button>
                `
              : nothing}
            ${this.config.standby_entity
              ? html`
                  <button
                    class="action"
                    @click=${() => this.toggleEntity(this.config.standby_entity!)}
                  >
                    Standby
                  </button>
                `
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

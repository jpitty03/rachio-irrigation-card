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
        if (seconds > 1) {
          nextTimers[entityId] = seconds - 1;
        } else {
          // Timer expired — turn off entity and clean up
          clearTimer(entityId);
          if (this.hass) {
            const domain = getDomain(entityId);
            this.hass.callService(domain, "turn_off", { entity_id: entityId });
          }
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
    return 2;
  }

  getGridOptions() {
    return {
      columns: 6,
      min_columns: 3,
      min_rows: 1,
    };
  }

  static getStubConfig(): Partial<RachioIrrigationCardConfig> {
    return {
      title: "Irrigation Quick Run",
      default_duration: 10,
      show_timer: true,
      zones: [
        { name: "Zone 1", location: "Front Yard", entity: "switch.zone_1", duration: 10 },
        { name: "Zone 2", location: "Front Side", entity: "switch.zone_2", duration: 10 },
        { name: "Zone 3", location: "Far Backyard", entity: "switch.zone_3", duration: 10 },
        { name: "Zone 4", location: "Backyard", entity: "switch.zone_4", duration: 10 },
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
    const cols = this.config.layout?.columns ?? 4;
    if (cols < 1 || cols > 6) {
      console.warn(
        `Rachio Irrigation Card: layout.columns ${cols} out of range [1,6]; falling back to 4.`
      );
      return 4;
    }
    return cols;
  }

  private get actionColumnCount(): number {
    let count = 1;
    if (this.config.rain_delay_entity) count++;
    if (this.config.standby_entity) count++;
    return count;
  }

  private renderLayoutVars(): string {
    const cols = this.columnCount;
    const actionCols = this.actionColumnCount;
    return `--zone-columns: ${cols}; --action-columns: ${actionCols};`;
  }

  private getActiveZone(): { zone: IrrigationZoneConfig; remaining: number; total: number } | null {
    if (!this.config) return null;
    for (const zone of this.config.zones) {
      const remaining = this.timers[zone.entity];
      if (remaining && remaining > 0) {
        const durationMinutes =
          zone.duration ?? this.config.default_duration ?? 10;
        const total = durationMinutes * 60;
        return { zone, remaining, total };
      }
    }
    return null;
  }

  private getZoneLabel(zone: IrrigationZoneConfig, index: number): string {
    return (
      zone.name ||
      this.getEntityState(zone.entity)?.attributes?.friendly_name ||
      `Zone ${index + 1}`
    );
  }
  private get showSchedules(): boolean {
    return this.config.show_schedules ?? true;
  }

  private renderSchedules() {
    if (!this.showSchedules) return nothing;
    if (!this.config.schedules || this.config.schedules.length === 0) return nothing;
    const enabled = this.config.schedules
      .map((id) => ({ id, state: this.getEntityState(id) }))
      .filter((s) => {
        if (!s.state) return false;
        // Rachio schedules expose an "enabled" attribute — prefer that
        // (case-insensitive), fall back to state === "on" for generic switches.
        const attr = s.state.attributes as Record<string, unknown>;
        const enabledAttr = attr?.enabled ?? attr?.Enabled;
        if (enabledAttr !== undefined) return enabledAttr === true;
        return isEntityOn(s.state.state);
      });
    if (enabled.length === 0) return nothing;
    return html`
      <div class="schedules">
        ${enabled.map(
          (s) => html`
            <div class="schedule-item">
              <ha-icon icon="mdi:calendar-clock"></ha-icon>
              <span>${s.state?.attributes?.friendly_name || s.id}</span>
            </div>
          `
        )}
      </div>
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

  private renderRainStatus() {
    const entity = this.getEntityState(this.config.rain_delay_entity!);
    const status = !entity ? "Unknown" : isEntityOn(entity.state) ? "Wet" : "Dry";
    return html`
      <div class="status-row">
        <div class="status-label">
          <ha-icon icon="mdi:weather-rainy"></ha-icon>
          <span>Rain Detected</span>
        </div>
        <div class="status-value">${status}</div>
      </div>
    `;
  }

  private renderProgress(active: { zone: IrrigationZoneConfig; remaining: number; total: number }) {
    const elapsed = active.total - active.remaining;
    const progress = Math.min(100, Math.max(0, Math.round((elapsed / active.total) * 100)));
    const zoneIndex = this.config.zones.indexOf(active.zone);
    const zoneLabel = this.getZoneLabel(active.zone, zoneIndex);
    return html`
      <div class="progress-section">
        <div class="progress-header">
          <span class="progress-zone">${zoneLabel} Running</span>
          <span class="progress-time">${formatRemaining(elapsed)} / ${formatRemaining(active.total)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
      </div>
    `;
  }

  private renderZone(zone: IrrigationZoneConfig, index: number) {
    const entity = this.getEntityState(zone.entity);
    const missing = !entity;
    const remaining = this.timers[zone.entity];
    const active = !!remaining && remaining > 0;
    const name = this.getZoneLabel(zone, index);
    const location = zone.location || "";
    const icon = zone.icon || "mdi:sprinkler";

    return html`
      <button
        class=${active ? "zone-button active" : "zone-button"}
        ?disabled=${missing}
        @click=${() => this.toggleZone(zone)}
      >
        <ha-icon icon=${icon} class="zone-icon"></ha-icon>
        <span class="zone-name">${name}</span>
        ${location ? html`<span class="zone-location">${location}</span>` : nothing}
        ${this.showStatus
          ? html`<span class="zone-status">${missing ? "Missing" : active ? "On" : "Off"}</span>`
          : nothing}
      </button>
    `;
  }

  private renderRainDelayButton() {
    const entity = this.getEntityState(this.config.rain_delay_entity!);
    const isOn = isEntityOn(entity?.state);
    return html`
      <button
        class="action-button"
        @click=${() => this.toggleEntity(this.config.rain_delay_entity!)}
      >
        <ha-icon icon="mdi:weather-rainy" class="action-icon"></ha-icon>
        <span class="action-name">Rain Delay</span>
        <span class="action-status">${!entity ? "Unknown" : isOn ? "Active" : "Off"}</span>
      </button>
    `;
  }

  private renderStandbyButton() {
    const entity = this.getEntityState(this.config.standby_entity!);
    const isOn = isEntityOn(entity?.state);
    return html`
      <button
        class="action-button"
        @click=${() => this.toggleEntity(this.config.standby_entity!)}
      >
        <ha-icon icon="mdi:sleep" class="action-icon"></ha-icon>
        <span class="action-name">Standby</span>
        <span class="action-status">${!entity ? "Unknown" : isOn ? "Active" : "Off"}</span>
      </button>
    `;
  }

  private renderStopButton() {
    return html`
      <button class="action-button stop" @click=${this.stopAll}>
        <ha-icon icon="mdi:stop" class="action-icon"></ha-icon>
        <span class="action-name">Stop</span>
        <span class="action-status">Watering</span>
      </button>
    `;
  }

  render() {
    if (!this.config) return nothing;
    const active = this.getActiveZone();
    const compact = this.config.layout?.compact;

    return html`
      <ha-card>
        <div
          class=${compact ? "quick-run-card compact" : "quick-run-card"}
          style=${this.renderLayoutVars()}
        >
          <div class="quick-run-header">
            <div class="title">${this.config.title}</div>
            <div class="connection-status">
              <ha-icon icon="mdi:check-circle"></ha-icon>
              <span>Connected</span>
            </div>
          </div>

          <div class="divider"></div>

          ${this.renderSchedules()}

          ${this.config.rain_delay_entity ? this.renderRainStatus() : nothing}

          ${this.showTimer && active ? this.renderProgress(active) : nothing}

          ${this.renderWarnings()}

          <div class="zone-grid">
            ${this.config.zones.map((zone, i) => this.renderZone(zone, i))}
          </div>

          <div class="action-grid">
            ${this.config.rain_delay_entity ? this.renderRainDelayButton() : nothing}
            ${this.config.standby_entity ? this.renderStandbyButton() : nothing}
            ${this.renderStopButton()}
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = [cardStyles];
}

customElements.define("rachio-irrigation-card", RachioIrrigationCard);

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
  interface HTMLElementTagNameMap {
    "rachio-irrigation-card": RachioIrrigationCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rachio-irrigation-card",
  name: "Rachio Irrigation Card",
  description:
    "A compact irrigation dashboard card for Rachio-style zone control.",
  preview: true,
  documentationURL:
    "https://github.com/jpitty03/rachio-irrigation-card/blob/main/README.md",
});
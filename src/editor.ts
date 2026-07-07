import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import type {
  RachioIrrigationCardConfig,
  IrrigationZoneConfig,
  LayoutConfig,
} from "./types";

const DEFAULT_DURATION = 10;

@customElement("rachio-irrigation-card-editor")
export class RachioIrrigationCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _config?: RachioIrrigationCardConfig;

  setConfig(config: RachioIrrigationCardConfig) {
    this._config = { ...config };
  }

  private _update(patch: Partial<RachioIrrigationCardConfig>) {
    if (!this._config) return;
    this._config = { ...this._config, ...patch };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
      })
    );
  }

  private _updateZone(index: number, patch: Partial<IrrigationZoneConfig>) {
    if (!this._config) return;
    const zones = this._config.zones.slice();
    zones[index] = { ...zones[index], ...patch };
    this._update({ zones });
  }

  private _addZone() {
    if (!this._config) return;
    const zones = this._config.zones.slice();
    const nextIndex = zones.length + 1;
    zones.push({
      name: `Zone ${nextIndex}`,
      entity: "",
      duration: this._config.default_duration ?? DEFAULT_DURATION,
    });
    this._update({ zones });
  }

  private _removeZone(index: number) {
    if (!this._config) return;
    if (this._config.zones.length <= 1) return;
    const zones = this._config.zones.slice();
    zones.splice(index, 1);
    this._update({ zones });
  }

  private _updateLayout(patch: Partial<LayoutConfig>) {
    if (!this._config) return;
    const layout = { ...(this._config.layout ?? {}), ...patch };
    this._update({ layout });
  }

  private _updateSchedule(index: number, value: string) {
    if (!this._config) return;
    const schedules = (this._config.schedules ?? []).slice();
    if (value) {
      schedules[index] = value;
    } else {
      schedules.splice(index, 1);
    }
    this._update({ schedules: schedules.length ? schedules : undefined });
  }

  private _addSchedule() {
    if (!this._config) return;
    const schedules = (this._config.schedules ?? []).slice();
    schedules.push("");
    this._update({ schedules });
  }

  private _numValue(value: string): number | undefined {
    const trimmed = value.trim();
    if (trimmed === "") return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : undefined;
  }

  render() {
    if (!this._config) return nothing;
    const layout = this._config.layout ?? {};
    return html`
      <div class="form">
        <div class="section-title">Header</div>
        <div class="field">
          <ha-textfield
            label="Title"
            .value=${this._config.title ?? ""}
            @input=${(e: Event) =>
              this._update({ title: (e.target as HTMLInputElement).value })}
          ></ha-textfield>
        </div>
        <div class="field">
          <ha-textfield
            label="Header icon (mdi:)"
            .value=${this._config.header_icon ?? ""}
            placeholder="mdi:sprinkler-variant"
            @input=${(e: Event) =>
              this._update({
                header_icon:
                  (e.target as HTMLInputElement).value.trim() || undefined,
              })}
          ></ha-textfield>
        </div>
        <div class="field">
          <ha-textfield
            label="Header subtitle"
            .value=${this._config.header_subtitle ?? ""}
            placeholder="e.g. Backyard zones"
            @input=${(e: Event) =>
              this._update({
                header_subtitle:
                  (e.target as HTMLInputElement).value || undefined,
              })}
          ></ha-textfield>
        </div>
        <div class="field row">
          <ha-formfield label="Show header">
            <ha-switch
              .checked=${this._config.show_header ?? true}
              @change=${(e: Event) =>
                this._update({
                  show_header: (e.target as HTMLInputElement).checked,
                })}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show connection status">
            <ha-switch
              .checked=${this._config.show_connection_status ?? true}
              @change=${(e: Event) =>
                this._update({
                  show_connection_status:
                    (e.target as HTMLInputElement).checked,
                })}
            ></ha-switch>
          </ha-formfield>
        </div>

        <div class="field row">
          <ha-textfield
            label="Default duration (minutes)"
            type="number"
            .value=${String(this._config.default_duration ?? DEFAULT_DURATION)}
            @input=${(e: Event) =>
              this._update({
                default_duration:
                  this._numValue((e.target as HTMLInputElement).value) ??
                  DEFAULT_DURATION,
              })}
          ></ha-textfield>
          <ha-formfield label="Show timer">
            <ha-switch
              .checked=${this._config.show_timer ?? true}
              @change=${(e: Event) =>
                this._update({
                  show_timer: (e.target as HTMLInputElement).checked,
                })}
            ></ha-switch>
          </ha-formfield>
        </div>

        <div class="zones">
          ${this._config.zones.map(
            (zone, i) => html`
              <fieldset>
                <legend>Zone ${i + 1}</legend>
                <div class="field">
                  <ha-textfield
                    label="Name"
                    .value=${zone.name ?? ""}
                    @input=${(e: Event) =>
                      this._updateZone(i, {
                        name: (e.target as HTMLInputElement).value,
                      })}
                  ></ha-textfield>
                </div>
                <div class="field">
                  <ha-textfield
                    label="Location"
                    .value=${zone.location ?? ""}
                    @input=${(e: Event) =>
                      this._updateZone(i, {
                        location: (e.target as HTMLInputElement).value,
                      })}
                  ></ha-textfield>
                </div>
                <div class="field">
                  <ha-entity-picker
                    .hass=${this.hass}
                    label="Entity"
                    .value=${zone.entity}
                    allow-custom-entity
                    @value-changed=${(e: CustomEvent) =>
                      this._updateZone(i, { entity: e.detail.value })}
                  ></ha-entity-picker>
                </div>
                <div class="field row">
                  <ha-textfield
                    label="Duration (minutes)"
                    type="number"
                    .value=${zone.duration != null ? String(zone.duration) : ""}
                    @input=${(e: Event) =>
                      this._updateZone(i, {
                        duration: this._numValue(
                          (e.target as HTMLInputElement).value
                        ),
                      })}
                  ></ha-textfield>
                  ${this._config!.zones.length > 1
                    ? html`<ha-icon-button
                        class="remove"
                        label="Remove zone"
                        .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                        @click=${() => this._removeZone(i)}
                      ></ha-icon-button>`
                    : nothing}
                </div>
              </fieldset>
            `
          )}
        </div>

        <ha-button @click=${this._addZone}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Add zone
        </ha-button>

        <div class="section-title">Optional entities</div>
        <div class="field">
          <ha-entity-picker
            .hass=${this.hass}
            label="Rain delay entity"
            .value=${this._config.rain_delay_entity ?? ""}
            allow-custom-entity
            @value-changed=${(e: CustomEvent) =>
              this._update({ rain_delay_entity: e.detail.value || undefined })}
          ></ha-entity-picker>
        </div>
        <div class="field">
          <ha-entity-picker
            .hass=${this.hass}
            label="Standby entity"
            .value=${this._config.standby_entity ?? ""}
            allow-custom-entity
            @value-changed=${(e: CustomEvent) =>
              this._update({ standby_entity: e.detail.value || undefined })}
          ></ha-entity-picker>
        </div>

        <div class="field row">
          <ha-formfield label="Show schedules">
            <ha-switch
              .checked=${this._config.show_schedules ?? true}
              @change=${(e: Event) =>
                this._update({
                  show_schedules: (e.target as HTMLInputElement).checked,
                })}
            ></ha-switch>
          </ha-formfield>
        </div>

        <div class="section-title">Schedule entities</div>
        ${(this._config.schedules ?? []).map(
          (scheduleId, i) => html`
            <div class="field row">
              <ha-entity-picker
                .hass=${this.hass}
                label="Schedule entity"
                .value=${scheduleId}
                allow-custom-entity
                @value-changed=${(e: CustomEvent) =>
                  this._updateSchedule(i, e.detail.value)}
              ></ha-entity-picker>
              <ha-icon-button
                class="remove"
                label="Remove schedule"
                .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                @click=${() => this._updateSchedule(i, "")}
              ></ha-icon-button>
            </div>
          `
        )}
        <ha-button @click=${this._addSchedule}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Add schedule
        </ha-button>

        <div class="section-title">Layout</div>
        <div class="field row">
          <ha-textfield
            label="Columns"
            type="number"
            min="1"
            max="6"
            .value=${String(layout.columns ?? 2)}
            @input=${(e: Event) =>
              this._updateLayout({
                columns: this._numValue(
                  (e.target as HTMLInputElement).value
                ),
              })}
          ></ha-textfield>
          <ha-formfield label="Compact">
            <ha-switch
              .checked=${layout.compact ?? false}
              @change=${(e: Event) =>
                this._updateLayout({
                  compact: (e.target as HTMLInputElement).checked,
                })}
            ></ha-switch>
          </ha-formfield>
        </div>
        <div class="field row">
          <ha-formfield label="Show status">
            <ha-switch
              .checked=${layout.show_status ?? true}
              @change=${(e: Event) =>
                this._updateLayout({
                  show_status: (e.target as HTMLInputElement).checked,
                })}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show timer (layout override)">
            <ha-switch
              .checked=${layout.show_timer ?? true}
              @change=${(e: Event) =>
                this._updateLayout({
                  show_timer: (e.target as HTMLInputElement).checked,
                })}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
    `;
  }

  static styles = css`
    .form {
      display: grid;
      gap: 12px;
    }
    .field {
      display: block;
    }
    .field.row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .field.row > * {
      flex: 1 1 auto;
    }
    .zones {
      display: grid;
      gap: 12px;
    }
    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 12px;
      margin: 0;
    }
    legend {
      font-weight: 600;
      padding: 0 6px;
    }
    .section-title {
      font-weight: 600;
      margin-top: 4px;
    }
    .remove {
      color: var(--error-color, #db4437);
      flex: 0 0 auto;
    }
    ha-icon {
      display: inline-flex;
      vertical-align: middle;
      margin-right: 4px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "rachio-irrigation-card-editor": RachioIrrigationCardEditor;
  }
}

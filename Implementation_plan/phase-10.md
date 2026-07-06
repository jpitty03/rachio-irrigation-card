Phase 10: Add visual editor support
Status: COMPLETE (v0.3.0)
Goal

Make the card usable through the Home Assistant UI editor instead of
YAML only.

Two parts:

1. `getStubConfig()` — provides the default YAML when the card is
   added from the card picker. Shipped in v0.2.0.
2. `getConfigElement()` — returns a custom `<rachio-irrigation-card-editor>`
   Lit element for full visual editing. Shipped in v0.3.0.

Implementation shipped in `src/editor.ts`:
- `RachioIrrigationCardEditor` (`@customElement("rachio-irrigation-card-editor")`)
- Implements `setConfig` + `config-changed` CustomEvent contract.
- Fields: title, default_duration, show_timer, per-zone name/entity/
  duration, add/remove zones (min 1), rain_delay_entity, standby_entity,
  layout (columns/compact/show_status/show_timer).
- Uses HA native elements: `ha-textfield`, `ha-entity-picker`,
  `ha-switch`, `ha-formfield`, `ha-icon-button`.
- Wired via `RachioIrrigationCard.getConfigElement()` with dynamic
  `import("./editor")`, inlined into the main bundle by
  `codeSplitting: false`.
- `custom-card-helpers` added as devDependency for `HomeAssistant` type.

Original plan reference below.

Two parts:

1. `getStubConfig()` — provides the default YAML when the card is
   added from the card picker. Cheap, high value. Ship in v0.1.0.
2. `getConfigElement()` — returns a custom `<rachio-irrigation-card-editor>`
   Lit element for full visual editing. Ship in v0.3.0.

Part 1: stub config (ship early)

```ts
class RachioIrrigationCard extends LitElement {
  // ...

  static getStubConfig() {
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
}
```

This makes the card appear in the HA card picker with usable defaults,
so users can drop it onto a dashboard and edit YAML from there. No
extra dependencies, no editor UI — just one static method.

Recommendation: ship `getStubConfig` in v0.1.0 even though the full
editor waits for v0.3.0.

Part 2: visual editor (v0.3.0)

Home Assistant custom cards provide a visual editor by returning a
custom element from `getConfigElement()`. The editor itself is a
separate Lit element that:

- Receives the current config via `setConfig`.
- Emits changes via a `config-changed` CustomEvent.
- Uses HA's built-in form elements (`<ha-textfield>`, `<ha-entity-picker>`,
  etc.) for native look and feel.

Add dependency:

```sh
npm install custom-card-helpers
```

New file `src/editor.ts`:

```ts
import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { RachioIrrigationCardConfig, IrrigationZoneConfig } from "./types";

@customElement("rachio-irrigation-card-editor")
export class RachioIrrigationCardEditor extends LitElement {
  @property({ attribute: false }) hass?: unknown;
  @state() private _config?: RachioIrrigationCardConfig;
  @state() private _changed = false;

  setConfig(config: RachioIrrigationCardConfig) {
    this._config = { ...config };
  }

  private _update(patch: Partial<RachioIrrigationCardConfig>) {
    if (!this._config) return;
    this._config = { ...this._config, ...patch };
    this._changed = true;
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

  render() {
    if (!this._config) return nothing;
    return html`
      <div class="form">
        <ha-textfield
          label="Title"
          .value=${this._config.title ?? ""}
          @input=${(e: Event) =>
            this._update({ title: (e.target as HTMLInputElement).value })}
        ></ha-textfield>

        <ha-textfield
          label="Default duration (minutes)"
          type="number"
          .value=${String(this._config.default_duration ?? 10)}
          @input=${(e: Event) =>
            this._update({
              default_duration: Number((e.target as HTMLInputElement).value),
            })}
        ></ha-textfield>

        ${this._config.zones.map(
          (zone, i) => html`
            <fieldset>
              <legend>Zone ${i + 1}</legend>
              <ha-textfield
                label="Name"
                .value=${zone.name ?? ""}
                @input=${(e: Event) =>
                  this._updateZone(i, {
                    name: (e.target as HTMLInputElement).value,
                  })}
              ></ha-textfield>
              <ha-entity-picker
                .hass=${this.hass}
                label="Entity"
                .value=${zone.entity}
                @value-changed=${(e: CustomEvent) =>
                  this._updateZone(i, { entity: e.detail.value })}
              ></ha-entity-picker>
              <ha-textfield
                label="Duration (minutes)"
                type="number"
                .value=${String(zone.duration ?? "")}
                @input=${(e: Event) =>
                  this._updateZone(i, {
                    duration: Number((e.target as HTMLInputElement).value),
                  })}
              ></ha-textfield>
            </fieldset>
          `
        )}

        <ha-entity-picker
          .hass=${this.hass}
          label="Rain delay entity"
          .value=${this._config.rain_delay_entity ?? ""}
          @value-changed=${(e: CustomEvent) =>
            this._update({ rain_delay_entity: e.detail.value })}
        ></ha-entity-picker>

        <ha-entity-picker
          .hass=${this.hass}
          label="Standby entity"
          .value=${this._config.standby_entity ?? ""}
          @value-changed=${(e: CustomEvent) =>
            this._update({ standby_entity: e.detail.value })}
        ></ha-entity-picker>
      </div>
    `;
  }

  static styles = css`
    .form { display: grid; gap: 12px; }
    fieldset { border: 1px solid var(--divider-color); padding: 8px; }
    legend { font-weight: 600; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "rachio-irrigation-card-editor": RachioIrrigationCardEditor;
  }
}
```

Wire the editor into the main card:

```ts
class RachioIrrigationCard extends LitElement {
  // ...

  static getStubConfig() { /* ... as above ... */ }

  public static async getConfigElement() {
    await import("./editor");
    return document.createElement("rachio-irrigation-card-editor");
  }
}
```

Build note: the editor is dynamically imported, so it lands in a
separate chunk. Since `vite.config.ts` sets `codeSplitting: false`,
it gets inlined into the main bundle — fine for a single-file HACS
card.

Recommendation

- v0.1.0: ship `getStubConfig` only (one static method, no new deps).
- v0.3.0: ship the full editor with `custom-card-helpers` and the
  `src/editor.ts` element above.

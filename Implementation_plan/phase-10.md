Phase 10: Add visual editor support
Goal

Make the card usable through the Home Assistant UI editor instead of YAML only.

Home Assistant custom cards can provide a custom visual editor by defining getConfigElement, and they can provide default config for the card picker with getStubConfig.

Add stub config
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
Add editor later

Do this after the card itself is stable.

Suggested editor fields:

Title
Zone list
  - name
  - entity picker
  - duration
Rain delay entity
Standby entity
Show timer
Columns
Compact mode
Recommendation

Do not build the editor in v0.1.0.

Ship YAML-only first.
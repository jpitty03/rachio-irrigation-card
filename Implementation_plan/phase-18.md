Phase 18: Versioning strategy
Goal

Ship small, stable versions. Each version is a GitHub release tag.

Suggested versions

v0.1.0
- Basic card
- Generic entity support (`switch.*`, `input_boolean.*`)
- Zone buttons (2-column grid)
- Rain delay button
- Standby button
- Stop all button
- Local visual timer (in-memory)
- Manual YAML config
- `getStubConfig` for the card picker
- HACS custom repository support (custom repo install)
- GitHub release workflow

v0.2.0
- Configurable actions (`tap_action`, `stop_action`) — Phase 6
- localStorage timer persistence — Phase 7
- Layout options (`layout.columns`, `compact`) — Phase 8
- Confirmation before Stop Watering
- Standby-disables-zones behavior
- Zone icon rendering
- Full config validation — Phase 9

v0.3.0
- Visual card editor — Phase 10
- Entity pickers in the editor
- Zone list editor (add/remove/reorder)
- `custom-card-helpers` dependency introduced

v1.0.0
- Stable config schema (no breaking changes after this)
- Documented Rachio examples
- Documented generic irrigation examples
- Test coverage (helpers + interaction) — Phase 15
- HACS validate CI passing — Phase 13
- HACS default repository submission (optional) — Phase 19

Semver rules for this repo

- PATCH: bug fixes, no config changes.
- MINOR: additive config fields, new optional features. Backwards compatible.
- MAJOR: config schema changes that require users to edit YAML.

Once v1.0.0 ships, any breaking config change requires a major bump
and a migration note in the README.

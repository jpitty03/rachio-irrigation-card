Phase 3: Create fake Rachio entities in local Home Assistant
Goal

Make your local Home Assistant look enough like Rachio that the card
can be tested end-to-end without real Rachio hardware.

This is a manual step performed on your Home Assistant instance.
No code changes happen in this phase.

1. Edit configuration.yaml

Add (or merge into) the `input_boolean:` section in your HA
`configuration.yaml`:

```yaml
input_boolean:
  rachio_zone_1:
    name: Rachio Zone 1
  rachio_zone_2:
    name: Rachio Zone 2
  rachio_zone_3:
    name: Rachio Zone 3
  rachio_zone_4:
    name: Rachio Zone 4
  rachio_rain_delay:
    name: Rachio Rain Delay
  rachio_standby:
    name: Rachio Standby
```

If you already have an `input_boolean:` block, merge these entries into it
rather than creating a second one.

2. Restart Home Assistant

Settings → System → Power button → Restart Home Assistant

(Or reload the `input_boolean` integration via Developer Tools → YAML →
"Reload input_boolean" to avoid a full restart.)

3. Confirm the entities exist

In Developer Tools → States, verify these entity IDs are present:

- `input_boolean.rachio_zone_1`
- `input_boolean.rachio_zone_2`
- `input_boolean.rachio_zone_3`
- `input_boolean.rachio_zone_4`
- `input_boolean.rachio_rain_delay`
- `input_boolean.rachio_standby`

Each should report `state: off` initially with a `friendly_name` attribute.

4. Reference config

A copy of this snippet is kept in the repo at
`examples/configuration-snippet.yaml` so it can be copied/pasted or
linked from the README in Phase 12.

Why input_boolean?

- Has a clean on/off state the card can read.
- Accepts `input_boolean.turn_on` / `turn_off` service calls.
- Requires no Rachio hardware or integration.
- Behaves identically to `switch.*` from the card's perspective.

These fake entities are only for local development. In a real Rachio
setup the zones would be `switch.*` entities provided by the Rachio
integration, and the card config would reference those instead.

Phase 15: Add testing
Goal

Catch logic bugs before installing in Home Assistant.

Recommended test types
1. TypeScript checks
npm run typecheck
2. Helper unit tests

Install:

npm install -D vitest

Add script:

"test": "vitest"

Test helpers like:

getDomain()
isEntityOn()
formatRemaining()
3. Mock hass behavior

Mock this:

const hass = {
  states: {
    "input_boolean.rachio_zone_1": {
      entity_id: "input_boolean.rachio_zone_1",
      state: "off",
      attributes: {
        friendly_name: "Zone 1",
      },
    },
  },
  callService: vi.fn(),
};

Test:

[ ] Clicking off zone calls input_boolean.turn_on
[ ] Clicking on zone calls input_boolean.turn_off
[ ] Stop calls turn_off for all zones
[ ] Missing entity renders warning
4. Browser/manual tests

Use local Home Assistant for final confidence.
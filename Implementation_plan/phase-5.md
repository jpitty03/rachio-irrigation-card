Phase 5: Test locally in Home Assistant
Goal

Load the built card manually before worrying about HACS.

1. Build the card
npm run build

Confirm this exists:

dist/rachio-irrigation-card.js
2. Copy to Home Assistant

Copy the file to:

/config/www/rachio-irrigation-card.js

In Home Assistant, files under /config/www are served under:

/local/

So your resource URL becomes:

/local/rachio-irrigation-card.js
3. Add the resource manually

In Home Assistant:

Settings → Dashboards → Resources → Add Resource

Add:

/local/rachio-irrigation-card.js

Type:

JavaScript Module
4. Add a manual card
type: custom:rachio-irrigation-card
title: Irrigation Quick Run
zones:
  - name: Zone 1
    entity: input_boolean.rachio_zone_1
    duration: 10
  - name: Zone 2
    entity: input_boolean.rachio_zone_2
    duration: 10
  - name: Zone 3
    entity: input_boolean.rachio_zone_3
    duration: 10
  - name: Zone 4
    entity: input_boolean.rachio_zone_4
    duration: 10
rain_delay_entity: input_boolean.rachio_rain_delay
standby_entity: input_boolean.rachio_standby
5. First local test checklist

Test:

[ ] Card loads without "Custom element doesn't exist"
[ ] Zones render in 2 columns
[ ] Each fake zone toggles on/off
[ ] Active zone changes style
[ ] Timer appears after turning on
[ ] Timer clears after turning off
[ ] Rain Delay button toggles fake entity
[ ] Standby button toggles fake entity
[ ] Stop Watering turns off all fake zones
[ ] Missing entity does not crash the card
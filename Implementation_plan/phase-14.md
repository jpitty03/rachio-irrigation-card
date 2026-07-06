Phase 14: Install through HACS as a custom repository
Goal

Validate the exact user install path.

In Home Assistant:

HACS → three-dot menu → Custom repositories

Add your GitHub repo URL.

Select type:

Dashboard

Then install it. HACS documentation describes custom repositories as adding the repository URL, selecting the correct type, and clicking add.

After installation, the resource should point roughly to:

/hacsfiles/rachio-irrigation-card/rachio-irrigation-card.js

Then test the card with:

type: custom:rachio-irrigation-card
title: Irrigation Quick Run
zones:
  - name: Zone 1
    entity: input_boolean.rachio_zone_1
    duration: 10
  - name: Zone 2
    entity: input_boolean.rachio_zone_2
    duration: 10
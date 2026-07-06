Phase 17: Add advanced Rachio-style features
Goal

Make the card feel purpose-built.

Possible features:

Per-zone quick run duration
Visual countdown timer
Connection/status icon
Rain delay button
Standby button
Stop watering button
Zone icons
Compact mode
2-column/3-column layout
Optional confirmation before Stop Watering
Disabled state when standby is on
Custom service actions
Example advanced config
type: custom:rachio-irrigation-card
title: Irrigation Quick Run
default_duration: 10
show_timer: true
layout:
  columns: 2
  compact: true
zones:
  - name: Front Lawn
    entity: switch.rachio_front_lawn
    duration: 10
    icon: mdi:sprinkler
  - name: Side Yard
    entity: switch.rachio_side_yard
    duration: 10
    icon: mdi:sprinkler
rain_delay_entity: switch.rachio_rain_delay
standby_entity: switch.rachio_standby
stop_action:
  service: rachio.stop_watering
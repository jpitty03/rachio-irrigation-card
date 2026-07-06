Phase 7: Add better timer behavior
Goal

Handle the “Rachio turns on then flips off” behavior you mentioned.

You have three possible timer models.

Option A: Pure local timer

This is easiest.

When the user taps a zone, start a timer in the card. The timer is visual only.

Pros:

Easy
No helper entities needed
Works without Rachio

Cons:

Timer resets if browser refreshes
Timer may not reflect real irrigation state
Option B: Store timer start time in localStorage

Better.

Store:

rachio-irrigation-card:input_boolean.rachio_zone_1:startTime

Pros:

Survives browser refresh
Still does not need extra Home Assistant helpers

Cons:

Only local to that browser/device
Not shared across tablets/phones
Option C: Use Home Assistant helper entities

Best long-term.

Allow config like:

zones:
  - name: Zone 1
    entity: switch.rachio_zone_1
    duration: 10
    timer_entity: timer.rachio_zone_1

Then the card can show timer.rachio_zone_1 state.

Pros:

Accurate across devices
Survives browser refresh
Works well with automations

Cons:

More setup for users
More docs
Recommendation

For version 0.1.0, use local timer.

For version 0.2.0, add optional timer_entity.
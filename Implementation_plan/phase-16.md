Phase 16: Rachio compatibility pass
Goal

Test with real-world Rachio configs without requiring your local environment to have Rachio.

Ask early users to report:

[ ] Entity domain
[ ] Entity state behavior
[ ] Whether zone switch stays on
[ ] Whether service call works
[ ] Whether stop watering works
[ ] Whether rain delay/standby are switch entities

Then add compatibility docs.

Possible findings:

Rachio zone entity turns on briefly then off
Rachio uses specific service for quick run
Rachio stop service works differently than generic switch.turn_off
Rain delay may not be exposed as a switch for every setup

Your response should be config flexibility, not hardcoded assumptions.
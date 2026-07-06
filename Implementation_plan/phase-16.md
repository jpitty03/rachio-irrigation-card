Phase 16: Rachio compatibility pass
Goal

Test with real-world Rachio configs without requiring your local
environment to have Rachio hardware. Collect findings from early users
and convert them into config flexibility, not hardcoded assumptions.

Ask early users to report

- [ ] Entity domain (switch.* vs other)
- [ ] Entity state behavior (does it stay "on" during a run?)
- [ ] Whether the zone switch stays on
- [ ] Whether `turn_on` / `turn_off` service calls work
- [ ] Whether a Rachio-specific service is needed for quick run
- [ ] Whether Stop Watering works via generic `turn_off` or needs
      `rachio.stop_watering` (Phase 6 `stop_action`)
- [ ] Whether rain delay / standby are `switch.*` entities or require
      service calls

Then add compatibility docs to the README.

Possible findings and responses

| Finding | Card response |
| ------- | ------------- |
| Rachio zone entity turns on briefly then off | Local timer (Phase 7) is the source of truth, not entity state. Document this. |
| Rachio uses `rachio.start_zone` with duration param | Add `tap_action` per zone (Phase 6) so users wire the service call. |
| Stop needs `rachio.stop_watering` | `stop_action` config (Phase 6) handles this. |
| Rain delay not a switch | Allow `tap_action` on rain_delay_entity in v0.2.0+. |
| Zone entity is a `sensor.*` with state, not a switch | Out of scope for v0.x — card assumes controllable on/off entities. |

Response principle

> Your response should be config flexibility, not hardcoded assumptions.
> Never import Rachio's service catalog into the card. Compatibility is
> achieved through user-configured `tap_action` / `stop_action`.

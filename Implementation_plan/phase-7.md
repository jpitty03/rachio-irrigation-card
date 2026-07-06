Phase 7: Add better timer behavior
Goal

Handle the "Rachio turns on briefly then flips off" reality and survive
browser refresh, without forcing users to create HA helper entities in
v0.1.0.

Background

Rachio zone switches often flip on for a moment then return to off
once a run is queued server-side. A pure visual timer that only
counts when the entity reads "on" would flicker and disappear. The
card's local timer is therefore the reliable "this zone is running"
indicator, not the entity state.

Three possible timer models

Option A: Pure local (in-memory) timer

When the user taps a zone, start a countdown in card state.

Pros:
- Easy. No helpers, no storage, no Rachio.
- Works without any HA setup.

Cons:
- Resets to zero on browser refresh.
- Not shared across devices (kitchen tablet and phone diverge).

Option B: localStorage-backed timer

Store start timestamp + duration in `localStorage`. On card connect,
recompute remaining time from the stored start.

Pros:
- Survives browser refresh on the same device.
- Still no HA helpers required.

Cons:
- Per-device, not shared.
- Stale entries accumulate if a zone finished while the device was off.

Option C: HA helper entities (timer.* or input_datetime.*)

Allow config:

```yaml
zones:
  - name: Zone 1
    entity: switch.rachio_zone_1
    duration: 10
    timer_entity: timer.rachio_zone_1
```

The card reads `timer.*` state and renders its remaining duration.

Pros:
- Accurate across all devices.
- Survives refresh, matches real irrigation state.
- Plays well with automations.

Cons:
- More setup for users.
- More docs.

Recommendation

- v0.1.0: Option A (pure local timer). Ship fast, validate the card UX.
- v0.2.0: Option B (localStorage). Big UX win for low cost.
- v0.3.0+: Option C (optional `timer_entity`). For power users.

Option B implementation (target for v0.2.0)

Storage key format:

```
rachio-irrigation-card:<entityId>:start
rachio-irrigation-card:<entityId>:duration
```

Helper additions to `src/helpers.ts`:

```ts
const STORAGE_PREFIX = "rachio-irrigation-card";

function timerKey(entityId: string, field: "start" | "duration"): string {
  return `${STORAGE_PREFIX}:${entityId}:${field}`;
}

export function saveTimerStart(entityId: string, durationMinutes: number): void {
  try {
    localStorage.setItem(
      timerKey(entityId, "start"),
      String(Date.now())
    );
    localStorage.setItem(
      timerKey(entityId, "duration"),
      String(durationMinutes * 60)
    );
  } catch {
    // localStorage may be unavailable (private mode, quota). Fail silent.
  }
}

export function clearTimer(entityId: string): void {
  try {
    localStorage.removeItem(timerKey(entityId, "start"));
    localStorage.removeItem(timerKey(entityId, "duration"));
  } catch {
    // ignore
  }
}

export function loadRemainingSeconds(entityId: string): number {
  try {
    const startStr = localStorage.getItem(timerKey(entityId, "start"));
    const durStr = localStorage.getItem(timerKey(entityId, "duration"));
    if (!startStr || !durStr) return 0;
    const start = Number(startStr);
    const duration = Number(durStr);
    if (!Number.isFinite(start) || !Number.isFinite(duration)) return 0;
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const remaining = duration - elapsed;
    if (remaining <= 0) {
      clearTimer(entityId);
      return 0;
    }
    return remaining;
  } catch {
    return 0;
  }
}
```

Card integration (v0.2.0):

- On `connectedCallback`: hydrate `this.timers` from
  `loadRemainingSeconds()` for every zone entity.
- On `toggleZone` turn-on: call `saveTimerStart(entity, duration)`.
- On `toggleZone` turn-off / `stopAll`: call `clearTimer(entity)`.
- The per-second interval decrements as before, but on refresh the
  timer continues from where it should be rather than resetting to 0.

Option C implementation sketch (v0.3.0+)

If `zone.timer_entity` is set, the card reads that entity's state
(`timer.*` exposes `remaining` attribute or a finishes_at timestamp)
and ignores the local timer for that zone. Falls back to local timer
if the timer entity is missing or idle.

v0.1.0 scope

Implement Option A only (already done in Phase 4). This phase exists
to document the upgrade path and lock in the storage key format so
v0.2.0 doesn't have to migrate.

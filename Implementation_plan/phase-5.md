Phase 5: Test locally in Home Assistant
Goal

Load the built card manually via `/local/` before worrying about HACS.
This is the fastest dev loop and remains the primary local-test method.

1. Build the card

```sh
npm run build
```

Confirm this exists:

```
dist/rachio-irrigation-card.js
```

For continuous dev, run in a separate terminal:

```sh
npm run dev
```

This rebuilds on every file change. Copy the rebuilt file to HA after
each change (see step 2).

2. Copy to Home Assistant

Copy the built file to your HA `www/` directory:

```
/config/www/rachio-irrigation-card.js
```

Files under `/config/www` are served by HA under:

```
/local/
```

So your resource URL becomes:

```
/local/rachio-irrigation-card.js
```

Tip: If HA is on another machine, use `scp`, an SFTP client, or a
Samba share. Some users symlink their repo `dist/` into `/config/www/`
for zero-copy dev — do that only on a dev HA instance, never in
production.

3. Add the resource (UI method — keeps storage mode intact)

Keep HA's default `resource_mode: storage`. Do NOT switch to
`resource_mode: yaml` — that makes HA ignore all UI-managed resources
and breaks any `custom:*` cards you added via the Resources menu.

UI path:
- Settings → Dashboards (the list page, NOT inside a dashboard)
- Top-right of that page: **Resources** button
  (if missing, enable Advanced Mode in your user profile:
   bottom-left icon → toggle Advanced Mode)
- Add resource:
  - URL: `/local/rachio-irrigation-card.js`
  - Type: `JavaScript Module` (NOT "JavaScript" — must be a module)

You must be an owner/admin user for the Resources button to appear.

4. Add a manual card

Edit a dashboard (edit mode → three dots → Raw configuration editor),
or add a Manual card via the UI, with:

```yaml
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
```

The `input_boolean.*` entities come from Phase 3.

5. Dev loop refresh

After rebuilding and copying the file, refresh the dashboard with a
cache-busting reload:

- Browser hard refresh: `Ctrl+Shift+R` (most browsers)
- Or bump the resource URL with a query string during active dev:
  `/local/rachio-irrigation-card.js?v=2`
  (increment `v` on each rebuild; remove it before HACS install)

Home Assistant aggressively caches `/local/` files, so a plain refresh
often loads the stale copy. The `?v=` trick is the most reliable
dev-loop workaround.

6. First local test checklist

Test:

- [ ] Card loads without "Custom element doesn't exist"
- [ ] No console errors in browser dev tools
- [ ] Zones render in 2 columns
- [ ] Each fake zone toggles on/off
- [ ] Active zone changes style
- [ ] Timer appears after turning on
- [ ] Timer counts down each second
- [ ] Timer clears after turning off
- [ ] Rain Delay button toggles fake entity
- [ ] Standby button toggles fake entity
- [ ] Stop Watering turns off all fake zones and clears all timers
- [ ] Missing entity does not crash the card (temporarily rename a
      zone entity to a non-existent id and reload)

7. Common pitfalls

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| "Custom element doesn't exist" | Resource URL wrong, or type set to "JavaScript" instead of "JavaScript Module" | Re-check resource config; type must be Module |
| Other custom cards break after adding resources | You switched `resource_mode: yaml` — that hides UI-managed resources | Revert to `resource_mode: storage`; add resources via the UI Resources button instead |
| Card renders but buttons do nothing | `hass` not wired, or service call domain is empty | Check `getDomain()` output in dev tools |
| Stale JS after rebuild | HA `/local/` caching | Use `?v=N` query string or hard refresh |
| "type: custom:rachio-irrigation-card" shown as text | Resource not loaded before card rendered | Add the resource first, then refresh the dashboard |
| Card shows error "requires a zones array" | YAML indent wrong (zones not a list) | Verify `zones:` is a list with `-` entries |

Manual `/local/` testing is the primary local-test method throughout
development. HACS install (Phase 14) is a later validation step, not
the dev loop.

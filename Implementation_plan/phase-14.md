Phase 14: Install through HACS as a custom repository
Goal

Validate the exact user install path end-to-end.

Prerequisites (must be done before this phase):

- Repo is public on GitHub.
- `hacs.json` exists in repo root (Phase 11).
- `README.md` and `LICENSE` exist (Phase 12).
- At least one GitHub release exists with
  `rachio-irrigation-card.js` attached (Phase 13), OR `dist/`
  contains the file on the default branch (not recommended).

Install steps in Home Assistant

1. Open HACS.
2. Click the three-dot menu (top right) → **Custom repositories**.
3. Paste your GitHub repo URL.
4. Select type: **Dashboard**.
5. Click **Add**.
6. Find "Rachio Irrigation Card" in the HACS dashboard list and click
   **Install**.
7. If prompted, allow HACS to add the Lovelace resource. Otherwise add
   it manually:
   - Settings → Dashboards → Resources → Add Resource
   - URL: `/hacsfiles/rachio-irrigation-card/rachio-irrigation-card.js`
   - Type: `JavaScript Module`
8. Refresh the dashboard.

Resource URL

After HACS install, the resource should point to:

```
/hacsfiles/rachio-irrigation-card/rachio-irrigation-card.js
```

HACS serves plugin files under `/hacsfiles/<repo-name>/`. The
filename matches the repo name (per Phase 11), so no path overrides
are needed.

Test config

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
```

Validation checklist

- [ ] HACS lists the repo under type "Dashboard"
- [ ] Install completes without errors
- [ ] Resource `/hacsfiles/rachio-irrigation-card/rachio-irrigation-card.js`
      is present in Settings → Dashboards → Resources
- [ ] Card renders in a dashboard without "Custom element doesn't exist"
- [ ] Toggling zones works through the HACS-installed resource (not
      just the `/local/` copy from Phase 5)
- [ ] Updating the card via HACS pulls the latest release file

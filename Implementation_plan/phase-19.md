Phase 19: HACS default repository submission (optional)
Goal

Eventually make the card discoverable in HACS without users adding a
custom repo URL.

Do this only after the card is stable (post-v1.0.0).

HACS default-store requirements (from the HACS docs):

- [ ] Public GitHub repo
- [ ] Good README with usage and screenshots
- [ ] Screenshots in the repo (for the HACS UI)
- [ ] GitHub releases published (not just tags)
- [ ] `hacs.json` in repo root
- [ ] GitHub repo description set (used in HACS UI)
- [ ] GitHub topics set on the repo
- [ ] Issue tracker enabled
- [ ] LICENSE present
- [ ] HACS validate action passing (Phase 13 `validate.yml`)
- [ ] No broken resource paths
- [ ] Install tested through HACS custom repo (Phase 14)
- [ ] At least one active user besides the author (preferred)

Submission process

HACS does not accept PRs to a default list directly. Instead, the
repo is nominated via the HACS/integration repository's issue tracker
or via the HACS Discord, and the maintainers review against the
checklist above. See the HACS "Include default repositories" doc.

Recommended build order

If building this from scratch, do it in this exact order:

1. Create Vite/Lit/TypeScript project (Phase 1)
2. Build empty custom card (Phase 4 stub)
3. Load it manually through `/local/` (Phase 5)
4. Add fake `input_boolean` Rachio entities (Phase 3)
5. Render the 2-column zone layout (Phase 4)
6. Add toggle behavior (Phase 4)
7. Add Stop Watering (Phase 4)
8. Add Rain Delay and Standby (Phase 4)
9. Add local timer (Phase 4)
10. Add missing-entity handling (Phase 4 / Phase 9)
11. Add `getStubConfig` (Phase 10 part 1)
12. Add `hacs.json` (Phase 11)
13. Write the README (Phase 12)
14. Add release + validate workflows (Phase 13)
15. Push to GitHub, publish a pre-release tag
16. Install as HACS custom Dashboard repository (Phase 14)
17. Add configurable service actions (Phase 6) — v0.2.0
18. Add localStorage timer (Phase 7) — v0.2.0
19. Add layout options (Phase 8) — v0.2.0
20. Add tests (Phase 15) — v0.2.0
21. Add screenshots/docs (Phase 12 update)
22. Add visual editor (Phase 10) — v0.3.0
23. Stabilize and ship v1.0.0
24. (Optional) Submit to HACS default store

MVP scope

Your MVP should not try to be "full Rachio-aware." The MVP is:

> A compact irrigation control card that works with any on/off Home
> Assistant zone entity, with Rachio-friendly examples.

That keeps local development easy, HACS packaging simple, and the card
useful to more people than just Rachio users.

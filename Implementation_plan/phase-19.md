Phase 19: HACS default repository submission, optional
Goal

Eventually make it discoverable in HACS without users adding a custom repo.

Do this only after the card is stable.

HACS says a repository can be added as a custom repository first, and for inclusion in the default HACS repositories it needs to be public, hosted on GitHub, and pass the required actions.

Before trying this:

[ ] Public GitHub repo
[ ] Good README
[ ] Screenshots
[ ] Releases
[ ] hacs.json
[ ] GitHub description
[ ] Issue tracker enabled
[ ] LICENSE
[ ] HACS action passing
[ ] No broken resource paths
[ ] Install tested through HACS custom repo
Recommended build order

If I were building this, I’d do it in this exact order:

1. Create Vite/Lit/TypeScript project
2. Build empty custom card
3. Load it manually through /local/
4. Add fake input_boolean Rachio entities
5. Render the 2-column zone layout
6. Add toggle behavior
7. Add Stop Watering
8. Add Rain Delay and Standby
9. Add local timer
10. Add missing-entity handling
11. Add README examples
12. Add hacs.json
13. Push to GitHub
14. Install as HACS custom Dashboard repository
15. Add configurable service actions
16. Add screenshots/docs
17. Add release workflow
18. Add visual editor later

Your MVP should not try to be “full Rachio-aware.” The MVP should be:

A compact irrigation control card that works with any on/off Home Assistant zone entity, with Rachio-friendly examples.

That keeps local development easy, HACS packaging simple, and the card useful to more people than just Rachio users.
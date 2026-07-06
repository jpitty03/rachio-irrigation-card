Phase 11: Prepare for HACS custom repository install
Goal

Make the repo installable by adding the correct metadata and file layout.

HACS supports custom repositories where the user adds the GitHub URL and selects the repository type. For this card, the type should be Dashboard.

Required files
README.md
LICENSE
hacs.json
dist/rachio-irrigation-card.js
hacs.json
{
  "name": "Rachio Irrigation Card",
  "filename": "rachio-irrigation-card.js",
  "content_in_root": false,
  "homeassistant": "2024.8.0"
}

Note: `hacs.json` MUST live in the root of the repository (not in dist/).
`content_in_root: false` refers to the *plugin content* (the built .js),
not the manifest file. The `filename` value is just a filename (no path
prefix); HACS searches dist/ first, then the latest GitHub release, then
the repo root for a `.js` file matching the repository name.

HACS general publishing requirements
- Public GitHub repository
- A repo description (used in HACS UI)
- GitHub topics on the repo (for searchability)
- README with usage info
- hacs.json in the repo root
- LICENSE

Important HACS notes

For Dashboard (plugin) repositories, HACS looks for `.js` files in this order:
1. The `dist/` directory in the repository
2. The latest GitHub release assets
3. The root of the repository

One of the `.js` files must have the same name as the repository.
Since the repo is `rachio-irrigation-card`, the built file must be
`rachio-irrigation-card.js` (it is).

The canonical reference template is custom-cards/boilerplate-card.
Skim its hacs.json, vite.config.ts, and release workflow before finalizing.

For your first version, keep it simple:

dist/rachio-irrigation-card.js

No images.

No extra CSS files.

No external assets.
Phase 13: GitHub release workflow + HACS validation CI
Goal

Automatically build the JS file when you publish a release, and run
the official HACS validation action on every push/PR so the repo
stays HACS-compliant.

Two workflows:

1. `.github/workflows/release.yml` — build + attach to release.
2. `.github/workflows/validate.yml` — HACS action + build sanity check
   on push/PR.

1. Release workflow

File: `.github/workflows/release.yml`

```yaml
name: Release

on:
  release:
    types:
      - published

jobs:
  build:
    name: Build card
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install
        run: npm ci

      - name: Typecheck
        run: npm run typecheck

      - name: Build
        run: npm run build

      - name: Upload build artifact to release
        uses: softprops/action-gh-release@v2
        with:
          files: dist/rachio-irrigation-card.js
```

2. HACS validation workflow

File: `.github/workflows/validate.yml`

Runs the official HACS action against the repo on every push and PR
to `main`. This catches hacs.json mistakes, missing files, and bad
structure before a release.

```yaml
name: Validate

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  hacs:
    name: HACS validation
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: HACS validation
        uses: hacs/action@main
        with:
          category: integration
        # NOTE: for a Dashboard (plugin) card, use:
        #   category: plugin
        # The action's `category` input maps to HACS repository types.
```

Wait — the HACS action validates integrations by default. For a
Dashboard (plugin) repository, set `category: plugin`. Corrected:

```yaml
      - name: HACS validation
        uses: hacs/action@main
        with:
          category: plugin
```

3. Build sanity check (optional, recommended)

Add a parallel job in `validate.yml` that builds the card to catch
typecheck/build regressions on PRs even without a release:

```yaml
  build:
    name: Build sanity check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run build
```

For the cleanest docs-aligned path, gitignore `dist/` from the start and
ship the built `.js` only via GitHub releases. HACS finds it through the
"latest release" search step, so committing build artifacts is unnecessary.

If you need to test HACS install before your release workflow is ready,
publish a pre-release tag (e.g. `v0.1.0-beta1`) and attach the built file
to it manually. Do not commit `dist/` to the repository.

My recommendation:

- From day one: gitignore dist/, ship via GitHub releases
- Use pre-release tags during early testing so installs are reproducible
- Enable the HACS validate workflow before the first public release so
  the repo passes the Phase 19 default-store checklist from day one
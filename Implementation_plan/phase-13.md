Phase 13: GitHub release workflow
Goal

Automatically build the JS file when you publish a release.

Create:

.github/workflows/release.yml

Example:

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

For the cleanest docs-aligned path, gitignore `dist/` from the start and
ship the built `.js` only via GitHub releases. HACS finds it through the
"latest release" search step, so committing build artifacts is unnecessary.

If you need to test HACS install before your release workflow is ready,
publish a pre-release tag (e.g. `v0.1.0-beta1`) and attach the built file
to it manually. Do not commit `dist/` to the repository.

My recommendation:

- From day one: gitignore dist/, ship via GitHub releases
- Use pre-release tags during early testing so installs are reproducible
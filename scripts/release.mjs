import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

function run(cmd, label) {
  console.log(`\n=== ${label} ===`);
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function runQuiet(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: "pipe" }).trim();
}

function bumpVersion(version, type) {
  const parts = version.split(".").map(Number);
  if (type === "major") {
    parts[0]++; parts[1] = 0; parts[2] = 0;
  } else if (type === "minor") {
    parts[1]++; parts[2] = 0;
  } else {
    parts[2]++;
  }
  return parts.join(".");
}

function findGh() {
  try {
    execSync("gh --version", { stdio: "pipe", encoding: "utf8" });
    return "gh";
  } catch {
    const full = "C:\\Program Files\\GitHub CLI\\gh.exe";
    try {
      execSync(`"${full}" --version`, { stdio: "pipe", encoding: "utf8" });
      return `"${full}"`;
    } catch {
      console.error("ERROR: gh CLI not found. Install it or add to PATH.");
      process.exit(1);
    }
  }
}

// ── Parse args ──
const bumpType = process.argv[2] || "patch";
if (!["patch", "minor", "major"].includes(bumpType)) {
  console.error(`Usage: npm run release [patch|minor|major]`);
  process.exit(1);
}

// ── Read + bump version ──
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const oldVersion = pkg.version;
const newVersion = bumpVersion(oldVersion, bumpType);
const tag = `v${newVersion}`;
pkg.version = newVersion;
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n", "utf8");

console.log(`\n========================================`);
console.log(`  Releasing ${tag} (was v${oldVersion})`);
console.log(`========================================`);

// ── Build, typecheck, test ──
run("npm run typecheck", "Typecheck");
run("npm run build", "Build");
run("npm test", "Tests");

// ── Stage all changes (including version bump) ──
run("git add -A", "Stage changes");

// ── Commit if there are staged changes ──
let hasStaged = true;
try {
  execSync("git diff --cached --quiet", { stdio: "pipe" });
  hasStaged = false;
} catch {
  hasStaged = true;
}

if (hasStaged) {
  // Generate commit message from recent commits since last tag
  let commitMsg = `release ${tag}`;
  try {
    const lastTag = runQuiet("git describe --tags --abbrev=0");
    const log = runQuiet(`git log ${lastTag}..HEAD --pretty=format:"- %s"`);
    if (log) {
      commitMsg = `release ${tag}\n\n${log}`;
    }
  } catch {
    // No previous tag — use simple message
  }
  run(`git commit -m "${commitMsg.replace(/\n/g, "\\n")}"`, "Commit");
} else {
  console.log("\nNo staged changes — skipping commit.");
}

// ── Push to main ──
run("git push origin main", "Push to main");

// ── Create + push tag ──
try {
  runQuiet(`git rev-parse ${tag}`);
  console.error(`\nERROR: Tag ${tag} already exists.`);
  process.exit(1);
} catch {
  // Tag doesn't exist — create it
}

run(`git tag -a ${tag} -m "${tag}"`, `Create tag ${tag}`);
run(`git push origin ${tag}`, `Push tag ${tag}`);

// ── Create GitHub release ──
const gh = findGh();

// Generate release notes from git log since last tag
let releaseNotes = `Release ${tag}`;
try {
  const lastTag = runQuiet("git describe --tags --abbrev=0 HEAD~1");
  const log = runQuiet(`git log ${lastTag}..HEAD --pretty=format:"- %s"`);
  if (log) {
    releaseNotes = `## Changes\n\n${log}`;
  }
} catch {
  // No previous tag
}

run(
  `${gh} release create ${tag} --title "${tag}" --notes "${releaseNotes.replace(/\n/g, "\\n")}" --target main`,
  "Create GitHub release"
);

console.log(`\n========================================`);
console.log(`  ${tag} released successfully!`);
console.log(`  https://github.com/jpitty03/rachio-irrigation-card/releases/tag/${tag}`);
console.log(`  GitHub Actions will build + attach the JS asset.`);
console.log(`========================================`);
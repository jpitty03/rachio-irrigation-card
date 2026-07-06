import { execSync } from "child_process";
import { readFileSync, existsSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

function loadEnv() {
  if (!existsSync(".env")) {
    console.error("ERROR: .env file not found.");
    console.error("Copy .env.example to .env and fill in your HA password:");
    console.error("  cp .env.example .env");
    process.exit(1);
  }
  const env = {};
  const content = readFileSync(".env", "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = val;
  }
  return env;
}

function findWinSCP() {
  const paths = [
    join(process.env.LOCALAPPDATA || "", "Programs", "WinSCP", "WinSCP.com"),
    "C:\\Program Files\\WinSCP\\WinSCP.com",
    "C:\\Program Files (x86)\\WinSCP\\WinSCP.com",
  ];
  for (const p of paths) {
    if (existsSync(p)) return p;
  }
  console.error("ERROR: WinSCP.com not found. Install WinSCP first:");
  console.error("  winget install WinSCP.WinSCP");
  process.exit(1);
}

const env = loadEnv();
const required = ["HA_HOST", "HA_USER", "HA_PASS"];
for (const key of required) {
  if (!env[key]) {
    console.error(`ERROR: ${key} not set in .env`);
    process.exit(1);
  }
}

const host = env.HA_HOST;
const port = env.HA_PORT || "22";
const user = env.HA_USER;
const pass = env.HA_PASS;
const remotePath = env.HA_REMOTE_PATH || "/homeassistant/www/community/rachio-irrigation-card/rachio-irrigation-card.js";
const localFile = "dist/rachio-irrigation-card.js";

console.log(`\n========================================`);
console.log(`  Local deploy to ${user}@${host}:${port}`);
console.log(`========================================`);

// ── Build ──
console.log("\n=== Build ===");
execSync("npm run build", { stdio: "inherit" });

// ── Create temp WinSCP script ──
const winscp = findWinSCP();
const scriptPath = join(tmpdir(), `winscp-deploy-${Date.now()}.txt`);
const scriptContent = [
  `option batch abort`,
  `option confirm off`,
  `open scp://${user}@${host}:${port}/ -hostkey=* -password=${pass}`,
  `put ${localFile} "${remotePath}"`,
  `exit`,
].join("\n");

writeFileSync(scriptPath, scriptContent, "utf8");

try {
  console.log(`\n=== Deploying via WinSCP ===`);
  execSync(`"${winscp}" /script="${scriptPath}"`, { stdio: "inherit" });
} finally {
  try { unlinkSync(scriptPath); } catch { /* ignore */ }
}

console.log(`\n========================================`);
console.log(`  Deployed to ${remotePath}`);
console.log(`  Hard-refresh your browser (Ctrl+Shift+R)`);
console.log(`========================================`);
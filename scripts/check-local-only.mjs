import { existsSync } from "node:fs";
import { join } from "node:path";

const forbiddenDeployFiles = [
  "vercel.json",
  "netlify.toml",
  "render.yaml",
  "wrangler.toml",
  "firebase.json",
  "fly.toml",
  ".github/workflows/deploy.yml",
  ".github/workflows/deploy.yaml",
];

const foundFiles = forbiddenDeployFiles.filter((filePath) => existsSync(join(process.cwd(), filePath)));

if (foundFiles.length > 0) {
  console.error("Public deployment config is not allowed in epioso-brain:");
  for (const filePath of foundFiles) {
    console.error(`- ${filePath}`);
  }

  process.exit(1);
}

console.info("Local-only check passed. No public deployment config found.");

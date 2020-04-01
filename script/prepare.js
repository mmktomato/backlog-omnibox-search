const fs = require("fs");

const target = process.argv[2];
if (!["chrome"].includes(target)) {
  throw new Error("Unknown target.");
}

// .env
const envFile = `.env.${target}`;
fs.copyFileSync(envFile, ".env", fs.constants.COPYFILE_EXCL);

// manifest.json
require("dotenv").config();
const manifestPath = "manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: "utf8" }));

if (target === "chrome") {
  delete manifest.browser_specific_settings;
  manifest.key = process.env.MANIFEST_KEY;
}

const content = JSON.stringify(manifest, null, "  ");
fs.writeFileSync(manifestPath, content, { encoding: "utf8" });

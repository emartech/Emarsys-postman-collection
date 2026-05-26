#!/usr/bin/env node
/**
 * Convert Emarsys Postman collection to Bruno v3 opencollection format.
 * Uses @usebruno/converters for the heavy lifting.
 */

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");
const { postmanToBruno, brunoToOpenCollection } = require("@usebruno/converters");

const REPO_ROOT = path.resolve(__dirname, "..");
const POSTMAN_FILE = path.join(REPO_ROOT, "postman", "Emarsys_postman_collection.json");
const BRUNO_DIR = path.join(REPO_ROOT, "bruno");

function sanitize(name) {
  return name.replace(/[<>:"/\\|?*]/g, "").trim();
}

function writeItems(items, outputDir) {
  for (const item of items) {
    const name = sanitize(item.info?.name || "Untitled");

    if (item.items) {
      // Folder — create directory and write folder.yml + children
      const folderDir = path.join(outputDir, name);
      fs.mkdirSync(folderDir, { recursive: true });

      // folder.yml with folder metadata (without nested items)
      const folderDoc = {};
      if (item.info) folderDoc.info = item.info;
      if (item.request) folderDoc.request = item.request;
      fs.writeFileSync(path.join(folderDir, "folder.yml"), YAML.stringify(folderDoc, { lineWidth: 0 }));

      writeItems(item.items, folderDir);
    } else {
      // Request — write as individual .yml file
      const doc = { ...item };
      fs.writeFileSync(path.join(outputDir, name + ".yml"), YAML.stringify(doc, { lineWidth: 0 }));
    }
  }
}

function convertEnvironments() {
  const envDest = path.join(BRUNO_DIR, "environments");
  fs.mkdirSync(envDest, { recursive: true });

  const secretKeys = ["OIDC_ClientId", "OIDC_Secret"];
  const envFiles = [];

  const publicEnvDir = path.join(REPO_ROOT, "postman", "environments");
  if (fs.existsSync(publicEnvDir)) {
    for (const file of fs.readdirSync(publicEnvDir)) {
      if (file.endsWith(".environment.json")) {
        envFiles.push(path.join(publicEnvDir, file));
      }
    }
  }

  const privateDir = path.join(REPO_ROOT, "postman", "environments-private");
  if (fs.existsSync(privateDir)) {
    for (const file of fs.readdirSync(privateDir)) {
      if (file.endsWith(".environment.json")) {
        envFiles.push(path.join(privateDir, file));
      }
    }
  }

  for (const filePath of envFiles) {
    const envData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const name = envData.name || path.basename(filePath, ".environment.json");
    const values = envData.values || [];

    const env = { name, variables: [] };
    for (const v of values) {
      const entry = { name: v.key, value: v.value || "" };
      if (secretKeys.includes(v.key)) entry.secret = true;
      env.variables.push(entry);
    }

    const outFile = path.join(envDest, sanitize(name) + ".yml");
    fs.writeFileSync(outFile, YAML.stringify(env, { lineWidth: 0 }));
    console.log(`  Environment: ${path.relative(REPO_ROOT, outFile)}`);
  }
}

async function main() {
  console.log(`Converting ${path.basename(POSTMAN_FILE)} to Bruno v3 opencollection format...`);

  const collection = JSON.parse(fs.readFileSync(POSTMAN_FILE, "utf8"));

  // Clean and create output
  if (fs.existsSync(BRUNO_DIR)) {
    fs.rmSync(BRUNO_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(BRUNO_DIR, { recursive: true });

  // Step 1: Convert Postman → Bruno internal format
  const brunoCollection = await postmanToBruno(collection);

  // Step 2: Convert Bruno internal → OpenCollection structure
  const oc = brunoToOpenCollection(brunoCollection);

  // Step 3: Patch token settings
  if (oc.request?.auth) {
    oc.request.auth.tokenConfig = {
      id: "credential",
      placement: { header: "Bearer" },
      source: "access_token",
    };
    oc.request.auth.settings = {
      autoFetchToken: true,
      autoRefreshToken: false,
    };
  }

  // Step 4: Write items as separate files, remove from opencollection.yml
  const items = oc.items || [];
  delete oc.items;
  oc.bundled = false;

  // Write opencollection.yml (collection-level only, no items)
  fs.writeFileSync(
    path.join(BRUNO_DIR, "opencollection.yml"),
    YAML.stringify(oc, { lineWidth: 0 })
  );
  console.log("  Created: opencollection.yml");

  // Write request files
  writeItems(items, BRUNO_DIR);
  console.log("  Processed request folders");

  // Environments
  convertEnvironments();

  // .gitignore
  fs.writeFileSync(
    path.join(BRUNO_DIR, ".gitignore"),
    "# Generated — do not commit\n*\n!.gitkeep\n"
  );

  console.log(`\nDone! Bruno collection written to: bruno/`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

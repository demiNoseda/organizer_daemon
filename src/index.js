//!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const exeDir = path.dirname(process.execPath);
const configPath = path.join(exeDir, "config.json");
const logPath = path.join(exeDir, "organizer.log");

let currentInterval = null;
let currentCheckInterval = null;

// Logging utility
function log(message) {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logPath, formatted);
  console.log(formatted.trim());
}

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`📁 Created folder: ${dirPath}`);
  }
}

function loadConfig() {
  try {
    const configRaw = fs.readFileSync(configPath, "utf8");
    return JSON.parse(configRaw);
  } catch (error) {
    log("❌ Error loading config: " + error.message);
    return null;
  }
}

function moveFiles(config) {
  if (!config || !config.watchFolders) return;

  config.watchFolders.forEach((folder) => {
    fs.readdir(folder, (err, files) => {
      if (err) {
        log(`❌ Error reading folder '${folder}': ` + err.message);
        return;
      }

      files.forEach((file) => {
        const fullPath = path.join(folder, file);
        const extension = path.extname(file);
        const fileName = path.basename(file);

        const rule = config.rules.find(
          (r) =>
            (r.extensions && r.extensions.includes(extension)) ||
            (r.nameContains && fileName.includes(r.nameContains))
        );

        if (rule) {
          ensureDirExists(rule.destination);
          const newPath = path.join(rule.destination, fileName);
          fs.rename(fullPath, newPath, (err) => {
            if (err) {
              log("❌ Error moving file: " + err.message);
              return;
            }
            log(`✅ Moved: ${fileName} -> ${rule.destination}`);
          });
        }
      });
    });
  });
}

function scheduleWatcher() {
  const config = loadConfig();
  if (!config) return;

  if (currentInterval === null) {
    log("▶️ Initial task execution...");
    moveFiles(config);
  }

  if (config.checkInterval !== currentCheckInterval) {
    if (currentInterval) clearInterval(currentInterval);

    currentCheckInterval = config.checkInterval;
    log(`🔁 New interval set: ${currentCheckInterval} ms`);

    currentInterval = setInterval(() => {
      const latestConfig = loadConfig();
      moveFiles(latestConfig);

      if (latestConfig?.checkInterval !== currentCheckInterval) {
        scheduleWatcher();
      }
    }, currentCheckInterval);
  }
}

log("🟢 Organizer Daemon started.");
scheduleWatcher();

#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const exeDir = path.dirname(process.execPath);
const configPath = path.join(exeDir, "config.json");
const logPath = path.join(exeDir, "organizer.log");

let currentInterval = null;
let currentCheckInterval = null;

// Logging utilitario
function log(message) {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logPath, formatted);
  console.log(formatted.trim()); // También en consola si la hay
}

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    log(`📁 Carpeta creada: ${dirPath}`);
  }
}

function loadConfig() {
  try {
    const configRaw = fs.readFileSync(configPath, "utf8");
    return JSON.parse(configRaw);
  } catch (error) {
    log("❌ Error cargando configuración: " + error.message);
    return null;
  }
}

function moveFiles(config) {
  if (!config) return;

  fs.readdir(config.watchFolder, (err, files) => {
    if (err) {
      log("❌ Error leyendo la carpeta: " + err.message);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(config.watchFolder, file);
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
            log("❌ Error moviendo el archivo: " + err.message);
            return;
          }
          log(`✅ Movido: ${fileName} -> ${rule.destination}`);
        });
      }
    });
  });
}

function scheduleWatcher() {
  const config = loadConfig();
  if (!config) return;

  // Ejecutar inmediatamente al iniciar
  if (currentInterval === null) {
    log("▶️ Ejecutando tarea inicial...");
    moveFiles(config);
  }

  // Si el intervalo cambió, reiniciar el ciclo
  if (config.checkInterval !== currentCheckInterval) {
    if (currentInterval) clearInterval(currentInterval);

    currentCheckInterval = config.checkInterval;
    log(`🔁 Nuevo intervalo configurado: ${currentCheckInterval} ms`);

    currentInterval = setInterval(() => {
      const latestConfig = loadConfig();
      moveFiles(latestConfig);

      if (latestConfig?.checkInterval !== currentCheckInterval) {
        scheduleWatcher(); // Reschedule
      }
    }, currentCheckInterval);
  }
}

log("🟢 Organizer Daemon iniciado.");
scheduleWatcher();

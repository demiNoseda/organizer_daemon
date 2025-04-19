#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

// Esto funciona incluso si está empaquetado
const exeDir = path.dirname(process.execPath);
const configPath = path.join(exeDir, "config.json");

function loadConfig() {
  try {
    const configRaw = fs.readFileSync(configPath, "utf8");
    const configParsed = JSON.parse(configRaw);
    console.log(
      "Configuracion cargada, ejecutandose cada ",
      configParsed.checkInterval
    );
    return configParsed;
  } catch (error) {
    console.error("Error cargando configuración:", error);
    process.exit(1);
  }
}

function moveFiles() {
  const config = loadConfig();

  fs.readdir(config.watchFolder, (err, files) => {
    if (err) {
      console.error("Error leyendo la carpeta:", err);
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
        const newPath = path.join(rule.destination, fileName);
        fs.rename(fullPath, newPath, (err) => {
          if (err) {
            console.error("Error moviendo el archivo:", err);
            return;
          }
          console.log(`Movido: ${fullPath} -> ${newPath}`);
        });
      }
    });
  });
}

console.log("Organizer Daemon iniciado...");
moveFiles();
setInterval(moveFiles, loadConfig().checkInterval);

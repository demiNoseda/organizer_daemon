const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "config.json");

function loadConfig() {
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
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

setInterval(moveFiles, loadConfig().checkInterval);

console.log(
  `Daemon iniciado. Revisando cambios basados en intervalo de configuración.`
);

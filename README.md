# Organizer Daemon

## 🧠 Descripción

**Organizer Daemon** es una herramienta multiplataforma diseñada para automatizar la organización de archivos en carpetas como "Descargas". Utiliza un archivo de configuración `config.json` para monitorear una carpeta y mover archivos según reglas basadas en nombres o extensiones.

Se puede ejecutar como:

- 🐧 Un **servicio de sistema** en Linux (`systemd`)
- 🪟 Un **servicio en segundo plano** en Windows (usando [`nssm`](https://nssm.cc))
- 🍎 Un **servicio de usuario** en macOS (usando `launchd`)

---

## ✨ Características

- Monitoreo automático de carpetas
- Organización por nombre de archivo o extensión
- Configuración editable en caliente
- Compatible con Linux, Windows y macOS
- Logs automáticos de actividad y errores
- Ejecución como servicio persistente

---

## 📁 Estructura del proyecto

```

organizer-daemon/
├── src/
│ ├── index.js
│ └── config/
│ └── default.config.json
│ └── scripts/
│ └── install-mac.sh
├── dist/
│ ├── win/
│ ├── linux/
│ └── mac/
├── scripts/
│ ├── build-all.sh
│ ├── build-all.ps1
│ └── install-linux.sh
├── service/
│ └── linux/
│ └── organizer.service
├── package.json
└── README.md

```

---

## ⚙️ Configuración (`config.json`)

Ejemplo:

```json
{
  "watchFolder": "/Users/demian/Downloads",
  "checkInterval": 1000,
  "rules": [
    {
      "nameContains": "Protocolo",
      "destination": "/Users/demian/Downloads/Facultad"
    },
    {
      "extensions": [".pdf"],
      "destination": "/Users/demian/Downloads/Documentos"
    }
  ]
}
```

### Campos

- `watchFolder`: Carpeta a monitorear.
- `checkInterval`: Intervalo de ejecución en milisegundos (ej: `604800000` = 1 semana).
- `rules`: Lista de reglas para mover archivos:
  - `nameContains`: Coincidencia por nombre.
  - `extensions`: Coincidencia por extensión.
- 📝 Se aplica la **primera regla que coincida**.
- 📁 Las carpetas de destino se crean automáticamente si no existen.

---

## 🐧 Instalación en Linux (`systemd`)

```bash
sudo cp service/linux/organizer.service /etc/systemd/system/
sudo systemctl daemon-reexec
sudo systemctl enable organizer
sudo systemctl start organizer
```

### Ver logs:

```bash
journalctl -u organizer -f
```

---

## 🪟 Instalación en Windows (`nssm`)

1. Descargá [`nssm`](https://nssm.cc/download)
2. Copiá `organizer-daemon.exe` y `config.json` a `dist/win/`
3. Ejecutá:

```powershell
& "C:\ruta\a\nssm.exe" install OrganizerDaemon
```

4. En la ventana:
   - **Application path**: `dist/win/organizer-daemon.exe`
   - **Startup directory**: `dist/win/`
5. Luego:

```powershell
& "C:\ruta\a\nssm.exe" start OrganizerDaemon
```

---

## 🍎 Instalación en macOS (`launchd`)

1. Generá el ejecutable y config:

```bash
npm run build:mac
```

2. Instalá como servicio con:

```bash
npm run mac:install
```

3. Ver logs:

```bash
npm run mac:logs
```

4. Detener o recargar:

```bash
npm run mac:unload     # Detener
npm run mac:install    # Instalar o reinstalar
npm run mac:reload     # Reiniciar servicio
```

---

## 🛠 Construcción multiplataforma

Instalá [`pkg`](https://github.com/vercel/pkg):

```bash
npm install -g pkg
```

### Desde `package.json`:

```bash
npm run build:all
```

Esto genera:

- `dist/win/organizer-daemon.exe`
- `dist/linux/organizer-daemon`
- `dist/mac/organizer-daemon`

y copia `config.json` a cada carpeta.

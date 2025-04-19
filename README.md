¡Perfecto, Demi! Acá tenés el contenido listo para copiar y pegar directamente como un `README.md` limpio:

---

```markdown
# Organizer Daemon

## 🧠 Descripción

**Organizer Daemon** es una herramienta multiplataforma diseñada para automatizar la organización de archivos en directorios como la carpeta de descargas. Utilizando un archivo de configuración `config.json`, monitorea una carpeta y mueve archivos según reglas definidas, basadas en nombres o extensiones.

Puede ejecutarse como:

- Un **servicio de sistema** en Linux (`systemd`)
- Un **servicio en segundo plano** en Windows (mediante [`nssm`](https://nssm.cc))
- Y próximamente en **macOS** (`launchd`)

## ✨ Características

- Monitoreo automático de directorios
- Organización por nombre de archivo o extensión
- Configuración editable sin reiniciar el daemon
- Soporte multiplataforma
- Fácil instalación y ejecución

## 📁 Estructura del proyecto
```

organizer-daemon/
├── src/
│ └── index.js
│ └── config/
│ └── default.config.json
├── dist/
│ ├── win/
│ │ ├── organizer-daemon.exe
│ │ └── config.json
│ ├── linux/
│ │ ├── organizer-daemon
│ │ └── config.json
│ └── mac/
│ ├── organizer-daemon
│ └── config.json
├── scripts/
│ ├── build-all.sh
│ ├── build-all.ps1
│ └── install-linux.sh
├── service/
│ └── linux/
│ └── organizer.service
├── package.json
└── README.md

````

## ⚙️ Configuración (`config.json`)

Ejemplo:

```json
{
  "watchFolder": "FOLDER WATCHED",
  "checkInterval": 30000,
  "rules": [
    {
      "nameContains": "NAME RULE",
      "destination": "DESTINATION PATH"
    },
    {
      "extensions": ["EXTENSION RULE"],
      "destination": "DESTINATION PATH"
    }
  ]
}

````

### Campos

- `watchFolder`: Carpeta a monitorear.
- `checkInterval`: Intervalo en milisegundos. (Ej: 604800000 = una vez por semana)
- `rules`: Reglas que determinan a dónde mover cada archivo:
  - `nameContains`: Subcadena que debe estar en el nombre del archivo.
  - `extensions`: Lista de extensiones que activa la regla.

> ⚠️ Se aplica la primera regla que coincida.

## 🐧 Instalación en Linux (modo servicio)

1. Instalá Node.js si vas a correr desde fuente:

```bash
sudo apt install nodejs npm
```

2. Copiá `organizer.service` a systemd:

```bash
sudo cp service/linux/organizer.service /etc/systemd/system/
sudo systemctl daemon-reexec
sudo systemctl enable organizer
sudo systemctl start organizer
```

3. Consultar estado:

```bash
sudo systemctl status organizer
journalctl -u organizer
```

## 🪟 Instalación en Windows (como servicio)

1. Descargá [`nssm`](https://nssm.cc/download) y colocá su ejecutable donde puedas accederlo.

2. Navegá a `dist/win/` y verificá que existan:

   - `organizer-daemon.exe`
   - `config.json`

3. Ejecutá desde PowerShell (como administrador):

```powershell
& "C:\ruta\a\nssm.exe" install OrganizerDaemon
```

4. En la ventana:

   - **Application path**: `dist/win/organizer-daemon.exe`
   - **Startup directory**: `dist/win/`

5. Iniciá el servicio:

```powershell
& "C:\ruta\a\nssm.exe" start OrganizerDaemon
```

## 🛠 Construcción multiplataforma

Requiere tener instalado [`pkg`](https://github.com/vercel/pkg):

```bash
npm install -g pkg
```

### Desde `package.json`:

```bash
npm run build:all
```

### Linux/macOS:

```bash
bash scripts/build-all.sh
```

### Windows:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-all.ps1
```

Esto generará los ejecutables en `dist/` y copiará el `config.json` correspondiente.

#!/bin/bash

set -e

# Ir al root del proyecto (asume que estás en src/scripts/)
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
EXECUTABLE="$PROJECT_ROOT/dist/mac/organizer-daemon"
CONFIG_DIR="$PROJECT_ROOT/dist/mac"
PLIST_PATH="$HOME/Library/LaunchAgents/com.organizer.daemon.plist"
LOG_DIR="$HOME/Library/Logs"

echo "📦 Instalando Organizer Daemon como servicio de usuario (launchd)..."
echo "📍 Ejecutable: $EXECUTABLE"

# Verificación básica
if [ ! -f "$EXECUTABLE" ]; then
  echo "❌ No se encontró el ejecutable en $EXECUTABLE"
  exit 1
fi

# Asegura que el ejecutable tenga permisos
chmod +x "$EXECUTABLE"

# Crear carpeta de logs si no existe
mkdir -p "$LOG_DIR"

# Crear archivo .plist con rutas absolutas
cat > "$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.organizer.daemon</string>

  <key>ProgramArguments</key>
  <array>
    <string>$EXECUTABLE</string>
  </array>

  <key>WorkingDirectory</key>
  <string>$CONFIG_DIR</string>

  <key>RunAtLoad</key>
  <true/>

  <key>StandardOutPath</key>
  <string>$LOG_DIR/organizer-daemon.log</string>

  <key>StandardErrorPath</key>
  <string>$LOG_DIR/organizer-daemon-error.log</string>
</dict>
</plist>
EOF

# Cargar servicio
launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH"

echo "✅ Servicio cargado correctamente."
echo "🟢 Logs: $LOG_DIR/organizer-daemon.log"

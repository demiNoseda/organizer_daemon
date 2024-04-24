# Organizer Daemon

## Descripción

El Organizer Daemon es un servicio de sistema diseñado para automatizar el proceso de organización de archivos en un sistema operativo basado en Linux. Utilizando un archivo de configuración `config.json`, el daemon monitorea una carpeta especificada y mueve archivos según las reglas definidas, basadas en nombres o extensiones de archivo. Esta herramienta es ideal para mantener organizadas las carpetas de descargas o cualquier otro directorio que requiera una gestión regular de archivos.

## Características

- Monitoreo automático de directorios.
- Organización de archivos basada en nombres o extensiones.
- Configurable y fácil de adaptar a diferentes necesidades de organización de archivos.
- Resistente a cambios en la configuración sin necesidad de reiniciar el servicio.
- Aplica la primer regla que se cumpla.

## Requisitos Previos

Antes de instalar y ejecutar el Organizer Daemon, asegúrate de tener instalado Node.js. Este proyecto ha sido probado con Node.js versión 18

## Instalación

1. Actualiza tu sistema y instala Node.js:

   ```bash
   sudo apt update
   sudo apt upgrade
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. Crea un directorio para el daemon y navega a él:

   ```bash
   mkdir ~/myDaemon
   cd ~/myDaemon
   ```

3. Copia los archivos `index.js`, `config.json`, y `organizer.service` en el directorio del proyecto.

## Configuración

Edita el archivo `config.json` para establecer las carpetas a monitorear y las reglas de movimiento de archivos:

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
```

**watchFolder**
Carpeta observada

**checkInterval**
Intervalo de tiempo en el que daemon revisa la carpeta

**nameContains**
Regla de texto por nombre del archivo.

**extensions**
Regla de texto por extension del archivo.

## Uso

Para gestionar el servicio del Organizer Daemon, usa los siguientes comandos:

- **Iniciar el servicio:**
  ```bash
  sudo systemctl start organizer
  ```
- **Detener el servicio:**
  ```bash
  sudo systemctl stop organizer
  ```
- **Reiniciar el servicio:**
  ```bash
  sudo systemctl restart organizer
  ```
- **Verificar el estado del servicio:**
  ```bash
  sudo systemctl status organizer
  ```

## Logs

Los registros del sistema se gestionan a través de syslog. Puedes ver los registros del daemon utilizando herramientas como `journalctl`:

```bash
journalctl -u organizer
```

---

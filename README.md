# Organizer Daemon

## Descripción

El Organizer Daemon es un servicio de sistema diseñado para automatizar el proceso de organización de archivos en un sistema operativo basado en Linux. Utilizando un archivo de configuración `config.json`, el daemon monitorea una carpeta especificada y mueve archivos según las reglas definidas, basadas en nombres o extensiones de archivo. Esta herramienta es ideal para mantener organizadas las carpetas de descargas o cualquier otro directorio que requiera una gestión regular de archivos.

## Características

- Monitoreo automático de directorios.
- Organización de archivos basada en nombres o extensiones.
- Configurable y fácil de adaptar a diferentes necesidades de organización de archivos.
- Resistente a cambios en la configuración sin necesidad de reiniciar el servicio.
- Aplica la primera regla que se cumpla.

## Requisitos Previos

Antes de instalar y ejecutar el Organizer Daemon, asegúrate de tener instalado Node.js. Este proyecto ha sido probado con Node.js versión 18.

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

3. Copia los archivos `index.js` y `config.json` en el directorio del proyecto.

4. Mueve el archivo `organizer.service` al directorio `/etc/systemd/system/` para integrarlo con el sistema de gestión de servicios de systemd.

## Configuración

Edita el archivo `config.json` para establecer las carpetas a monitorear y las reglas de movimiento de archivos. Aquí tienes un ejemplo de cómo configurar las reglas:

```json
{
  "watchFolder": "/home/debian/Descargas/",
  "checkInterval": 5000,
  "rules": [
    {
      "nameContains": "honorarios",
      "destination": "/home/debian/Documentos/honorarios/"
    },
    {
      "extensions": [".pdf"],
      "destination": "/home/debian/Documentos/archivos_pdf/"
    }
  ]
}
```

### Detalles de configuración

- **watchFolder**: Especifica la ruta completa del directorio que el daemon debe monitorear.
- **checkInterval**: Define el intervalo de tiempo, en milisegundos, en el que el daemon revisa el directorio watchFolder para cambios.
- **nameContains**: Define una subcadena que debe estar presente en el nombre del archivo para que la regla se aplique.
- **extensions**: Especifica un arreglo de extensiones de archivo. Si el archivo tiene una extensión incluida en esta lista, la regla se aplicará.

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

![ChatGPT Image 22 abr 2025, 02_18_59 p m](https://github.com/user-attachments/assets/44622309-7cf8-43c9-b1b6-6841e4c802ac)

## 🧠 Description

**Organizer Daemon** is a cross-platform tool designed to automate file organization in folders like "Downloads". It uses a `config.json` file to monitor a folder and move files based on name or extension-based rules.

It can run as:

- 🐧 A **system service** on Linux (`systemd`)
- 🪟 A **background service** on Windows (using [`nssm`](https://nssm.cc))
- 🍎 A **user service** on macOS (using `launchd`)

---

## ✨ Features

- Automatic folder monitoring
- File organization by name or extension
- Hot-reloadable configuration
- Compatible with Linux, Windows, and macOS
- Automatic logging of activity and errors
- Persistent service execution

---

## 📁 Project Structure

```
organizer-daemon/
├── src/
│   ├── index.js
│   └── config/
│       └── default.config.json
│   └── scripts/
│       └── install-mac.sh
├── dist/
│   ├── win/
│   ├── linux/
│   └── mac/
├── scripts/
│   └── install-linux.sh
├── service/
│   └── linux/
│       └── organizer.service
├── package.json
└── README.md
```

---

## ⚙️ Configuration (`config.json`)

Example:

```json
{
  "watchFolders": ["/Users/john/Downloads", "/Users/john/OtherFolder"],
  "checkInterval": 5000,
  "rules": [
    {
      "nameContains": "honorarios",
      "destination": "/Users/john/Downloads/College"
    },
    {
      "extensions": [".pdf"],
      "destination": "/Users/john/Downloads/Documents"
    }
  ]
}
```

### Fields

- `watchFolder`: Folder to monitor.
- `checkInterval`: Time interval in milliseconds (e.g., `604800000` = 1 week).
- `rules`: List of rules for file movement:
  - `nameContains`: Match by filename.
  - `extensions`: Match by file extension.
- 📝 Only the **first matching rule** will be applied.
- 📁 Destination folders are automatically created if they don’t exist.

---

## 🛠 Cross-platform Build

You’ll need [`pkg`](https://github.com/vercel/pkg) installed globally to build:

```bash
npm install -g pkg
```

---

## 🐧 Linux Installation (`systemd`)

```bash
sudo cp service/linux/organizer.service /etc/systemd/system/
sudo systemctl daemon-reexec
sudo systemctl enable organizer
sudo systemctl start organizer
```

### View logs:

```bash
journalctl -u organizer -f
```

---

## 🪟 Windows Installation (`nssm`)

1. Download [`nssm`](https://nssm.cc/download) and make sure it's added to your system path.
2. Run the Windows build:

```powershell
npm run build:win
```

3. Set up your `config.json` in the `dist/win/` folder.
4. Install the service with:

```powershell
nssm install OrganizerDaemon
```

5. In the window:

   - **Application path**: `path-to-project/dist/win/organizer-daemon.exe`
   - **Startup directory**: `path-to-project/dist/win/`

6. Start the service:

```powershell
nssm start OrganizerDaemon
```

You're all set! The daemon is now running.

To update the configuration, simply edit:
`path-to-project/dist/win/config.json`  
📝 No need to stop the daemon when updating the config.

To view logs:
`path-to-project/dist/win/organizer.log`

To stop the daemon:

```powershell
nssm stop OrganizerDaemon
```

---

## 🍎 macOS Installation (`launchd`)

1. Build the binary and generate the config:

```bash
npm run build:mac
```

2. Install the service:

```bash
npm run mac:install
```

3. View logs:

```bash
npm run mac:logs
```

4. Stop or reload:

```bash
npm run mac:unload     # Stop
npm run mac:install    # Install or reinstall
npm run mac:reload     # Restart the service
```

You're all set! The daemon is now running.

To update the configuration, simply edit:
`path-to-project/dist/win/config.json`  
📝 No need to stop the daemon when updating the config.

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).

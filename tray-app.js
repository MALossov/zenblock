const { app, Tray, Menu, shell, BrowserWindow } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');

const APP_DIR = __dirname;
const PID_FILE = path.join(APP_DIR, '.zenblock.pid');
let tray = null;
let serviceProcess = null;
let isAutoStart = false;

// Check if service is running
function isServiceRunning() {
  if (!fs.existsSync(PID_FILE)) {
    return false;
  }
  
  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
    process.kill(pid, 0);
    return true;
  } catch (e) {
    fs.unlinkSync(PID_FILE);
    return false;
  }
}

// Start service
function startService() {
  if (isServiceRunning()) {
    return;
  }

  serviceProcess = spawn('npm', ['run', 'start'], {
    cwd: APP_DIR,
    detached: true,
    stdio: 'ignore'
  });
  
  serviceProcess.unref();
  fs.writeFileSync(PID_FILE, serviceProcess.pid.toString());
  updateTrayMenu();
}

// Stop service
function stopService() {
  if (!isServiceRunning()) {
    return;
  }

  const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
  
  try {
    process.kill(pid, 'SIGTERM');
    fs.unlinkSync(PID_FILE);
  } catch (e) {
    console.error('Failed to stop service:', e);
  }
  
  updateTrayMenu();
}

// Toggle auto-start
function toggleAutoStart() {
  isAutoStart = !isAutoStart;
  
  if (isAutoStart) {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true
    });
  } else {
    app.setLoginItemSettings({
      openAtLogin: false
    });
  }
  
  updateTrayMenu();
}

// Open URL in browser
function openUrl(url) {
  shell.openExternal(url);
}

// Update tray menu
function updateTrayMenu() {
  const isRunning = isServiceRunning();
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'ZenBlock',
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: 'Open Console',
      click: () => openUrl('http://localhost:3000/zh')
    },
    {
      label: 'View Dashboard',
      click: () => openUrl('http://localhost:3000/zh/dashboard')
    },
    {
      type: 'separator'
    },
    {
      label: isRunning ? 'Stop Service' : 'Start Service',
      click: () => {
        if (isRunning) {
          stopService();
        } else {
          startService();
        }
      }
    },
    {
      label: 'Restart Service',
      enabled: isRunning,
      click: () => {
        stopService();
        setTimeout(startService, 2000);
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Auto-Start on Boot',
      type: 'checkbox',
      checked: isAutoStart,
      click: toggleAutoStart
    },
    {
      type: 'separator'
    },
    {
      label: 'Status: ' + (isRunning ? 'Running' : 'Stopped'),
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: 'Exit',
      click: () => {
        if (isServiceRunning()) {
          stopService();
        }
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  
  // Update tooltip
  tray.setToolTip(`ZenBlock - ${isRunning ? 'Running' : 'Stopped'}`);
}

// Create tray icon
function createTray() {
  // Try to use custom icon, fallback to system icon
  let iconPath = path.join(APP_DIR, 'public', 'favicon.ico');
  
  if (!fs.existsSync(iconPath)) {
    iconPath = path.join(APP_DIR, 'tray-icon.png');
  }

  tray = new Tray(iconPath);
  tray.setToolTip('ZenBlock');
  
  updateTrayMenu();

  // Update menu every 5 seconds to reflect service status
  setInterval(updateTrayMenu, 5000);
}

// Check if auto-start is enabled
function checkAutoStart() {
  const settings = app.getLoginItemSettings();
  isAutoStart = settings.openAtLogin;
}

// App ready
app.whenReady().then(() => {
  checkAutoStart();
  createTray();
  
  // Auto-start service if auto-start is enabled
  if (isAutoStart && !isServiceRunning()) {
    startService();
  }
});

// Prevent window from showing
app.on('window-all-closed', (e) => {
  e.preventDefault();
});

// Quit when all windows are closed (except on macOS)
app.on('quit', () => {
  if (isServiceRunning()) {
    stopService();
  }
});

// macOS: Re-create tray when app is activated
app.on('activate', () => {
  if (tray === null) {
    createTray();
  }
});

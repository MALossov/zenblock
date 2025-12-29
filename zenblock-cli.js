#!/usr/bin/env node

const { program } = require('commander');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const APP_NAME = 'ZenBlock';
const APP_DIR = path.resolve(__dirname);
const PID_FILE = path.join(APP_DIR, '.zenblock.pid');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: APP_DIR }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Check if service is running
function isRunning() {
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
async function startService() {
  if (isRunning()) {
    log('Service is already running!', 'yellow');
    return;
  }

  log('Starting ZenBlock service...', 'cyan');
  
  const child = spawn('npm', ['run', 'start'], {
    cwd: APP_DIR,
    detached: true,
    stdio: 'ignore'
  });
  
  child.unref();
  fs.writeFileSync(PID_FILE, child.pid.toString());
  
  log('Service started successfully!', 'green');
  log(`PID: ${child.pid}`, 'blue');
}

// Stop service
function stopService() {
  if (!isRunning()) {
    log('Service is not running!', 'yellow');
    return;
  }

  log('Stopping ZenBlock service...', 'cyan');
  
  const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
  
  try {
    process.kill(pid, 'SIGTERM');
    fs.unlinkSync(PID_FILE);
    log('Service stopped successfully!', 'green');
  } catch (e) {
    log('Failed to stop service!', 'red');
    console.error(e);
  }
}

// Restart service
async function restartService() {
  log('Restarting ZenBlock service...', 'cyan');
  stopService();
  await new Promise(resolve => setTimeout(resolve, 2000));
  await startService();
}

// Service status
function serviceStatus() {
  if (isRunning()) {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'));
    log('Service Status: RUNNING', 'green');
    log(`PID: ${pid}`, 'blue');
  } else {
    log('Service Status: STOPPED', 'red');
  }
}

// Install service (auto-start)
async function installService() {
  log('Installing ZenBlock service...', 'cyan');
  
  const platform = os.platform();
  
  if (platform === 'win32') {
    // Windows: Create startup shortcut
    const startupDir = path.join(
      process.env.APPDATA,
      'Microsoft\\Windows\\Start Menu\\Programs\\Startup'
    );
    
    const vbsScript = `
Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = "${startupDir}\\ZenBlock.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "node"
oLink.Arguments = "${path.join(APP_DIR, 'zenblock-cli.js')} start"
oLink.WorkingDirectory = "${APP_DIR}"
oLink.WindowStyle = 7
oLink.Save
`;
    
    const vbsFile = path.join(APP_DIR, 'create-shortcut.vbs');
    fs.writeFileSync(vbsFile, vbsScript);
    
    try {
      await execAsync(`cscript //nologo "${vbsFile}"`);
      fs.unlinkSync(vbsFile);
      log('Auto-start enabled successfully!', 'green');
    } catch (e) {
      log('Failed to enable auto-start!', 'red');
      console.error(e);
    }
  } else if (platform === 'darwin') {
    // macOS: Create LaunchAgent
    const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.zenblock.app</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>${path.join(APP_DIR, 'zenblock-cli.js')}</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
</dict>
</plist>`;
    
    const plistPath = path.join(
      os.homedir(),
      'Library/LaunchAgents/com.zenblock.app.plist'
    );
    
    fs.writeFileSync(plistPath, plistContent);
    await execAsync(`launchctl load ${plistPath}`);
    log('Auto-start enabled successfully!', 'green');
  } else {
    // Linux: Create systemd service
    const serviceContent = `[Unit]
Description=ZenBlock Service
After=network.target

[Service]
Type=simple
User=${os.userInfo().username}
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/node ${path.join(APP_DIR, 'zenblock-cli.js')} start
Restart=on-failure

[Install]
WantedBy=multi-user.target`;
    
    const servicePath = path.join(os.homedir(), '.config/systemd/user/zenblock.service');
    const serviceDir = path.dirname(servicePath);
    
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }
    
    fs.writeFileSync(servicePath, serviceContent);
    await execAsync('systemctl --user daemon-reload');
    await execAsync('systemctl --user enable zenblock.service');
    log('Auto-start enabled successfully!', 'green');
  }
}

// Uninstall service
async function uninstallService() {
  log('Uninstalling ZenBlock service...', 'cyan');
  
  const platform = os.platform();
  
  try {
    if (platform === 'win32') {
      const startupFile = path.join(
        process.env.APPDATA,
        'Microsoft\\Windows\\Start Menu\\Programs\\Startup\\ZenBlock.lnk'
      );
      
      if (fs.existsSync(startupFile)) {
        fs.unlinkSync(startupFile);
      }
    } else if (platform === 'darwin') {
      const plistPath = path.join(
        os.homedir(),
        'Library/LaunchAgents/com.zenblock.app.plist'
      );
      
      await execAsync(`launchctl unload ${plistPath}`);
      fs.unlinkSync(plistPath);
    } else {
      await execAsync('systemctl --user disable zenblock.service');
      const servicePath = path.join(os.homedir(), '.config/systemd/user/zenblock.service');
      fs.unlinkSync(servicePath);
      await execAsync('systemctl --user daemon-reload');
    }
    
    log('Auto-start disabled successfully!', 'green');
  } catch (e) {
    log('Failed to disable auto-start!', 'red');
    console.error(e);
  }
}

// Open console in browser
function openConsole() {
  const url = 'http://localhost:3000/zh';
  const platform = os.platform();
  
  const command = platform === 'win32' ? 'start' :
                  platform === 'darwin' ? 'open' : 'xdg-open';
  
  exec(`${command} ${url}`);
  log('Opening console in browser...', 'cyan');
}

// Open dashboard
function openDashboard() {
  const url = 'http://localhost:3000/zh/dashboard';
  const platform = os.platform();
  
  const command = platform === 'win32' ? 'start' :
                  platform === 'darwin' ? 'open' : 'xdg-open';
  
  exec(`${command} ${url}`);
  log('Opening dashboard in browser...', 'cyan');
}

// View logs
async function viewLogs() {
  log('Recent logs:', 'cyan');
  // Implement log viewing logic
  log('Log viewing not yet implemented', 'yellow');
}

// CLI Setup
program
  .name('zenblock-cli')
  .description('ZenBlock Service Management CLI')
  .version('1.0.0');

program
  .command('start')
  .description('Start ZenBlock service')
  .action(startService);

program
  .command('stop')
  .description('Stop ZenBlock service')
  .action(stopService);

program
  .command('restart')
  .description('Restart ZenBlock service')
  .action(restartService);

program
  .command('status')
  .description('Check service status')
  .action(serviceStatus);

program
  .command('install')
  .description('Install service (enable auto-start)')
  .action(installService);

program
  .command('uninstall')
  .description('Uninstall service (disable auto-start)')
  .action(uninstallService);

program
  .command('open')
  .description('Open console in browser')
  .action(openConsole);

program
  .command('dashboard')
  .description('Open dashboard in browser')
  .action(openDashboard);

program
  .command('logs')
  .description('View service logs')
  .action(viewLogs);

program.parse();

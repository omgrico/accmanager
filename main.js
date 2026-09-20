const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let win;
let updateToken = '';
try { updateToken = require('./update-token.js').token || ''; } catch (e) { /* no token file, fine for local dev */ }

function createWindow() {
  win = new BrowserWindow({
    width: 440,
    height: 700,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    frame: false,
    transparent: true,
    hasShadow: true,
    backgroundColor: '#00000000',
    icon: path.join(__dirname, 'renderer', 'icon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

function setupAutoUpdater() {
  // Private GitHub repo releases require an auth token to download assets.
  if (updateToken) {
    autoUpdater.requestHeaders = { Authorization: `token ${updateToken}` };
  }
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-downloaded', () => {
    if (win) win.webContents.send('update:ready');
  });
  autoUpdater.on('error', (err) => {
    console.error('autoUpdater error:', err == null ? 'unknown' : (err.stack || err).toString());
  });

  // Check on launch, then every 2 hours while running.
  autoUpdater.checkForUpdates().catch(() => {});
  setInterval(() => { autoUpdater.checkForUpdates().catch(() => {}); }, 2 * 60 * 60 * 1000);
}

ipcMain.handle('window:close', () => { if (win) win.close(); });
ipcMain.handle('update:install', () => { autoUpdater.quitAndInstall(); });
ipcMain.handle('app:getVersion', () => app.getVersion());

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

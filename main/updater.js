// Libs
const { BrowserWindow, ipcMain } = require('electron');
let autoUpdater; // will be set dynamically
try {
  ({ autoUpdater } = require('electron-updater'));
} catch (_) {
  // eslint-disable-next-line no-console
  console.warn('[Carthex] electron-updater not available → auto-update disabled');
}
const appConfig = require('electron-settings');
const isDev = require('electron-is-dev');

// Set mainWindow
const mainWindowID = appConfig.get('mainWindowID');
const mainWindow = BrowserWindow.fromId(mainWindowID);

// Disable Auto Downloading update;
if (autoUpdater) autoUpdater.autoDownload = false;

// Check for update silently
let silentMode = true;

// HANDLING IPC
// Check for updates manually
ipcMain.on('check-for-updates', event => {
  // Turn off silent mode first
  silentMode = false;
  checkForUpdate();
});

// Start Download
ipcMain.on('update-download-started', () => {
  if (autoUpdater) autoUpdater.downloadUpdate();
});

// CHECKING FOR UPDATE EVENTS
// Checking for Update
if (autoUpdater) autoUpdater.on('checking-for-update', () => {
  // Only notice user when they checked manually
  if (!silentMode) {
    mainWindow.send('update-checking');
  }
});

// Update Available
if (autoUpdater) autoUpdater.on('update-available', info => {
  mainWindow.send('update-available', info);
});

// Update Not Available
if (autoUpdater) autoUpdater.on('update-not-available', () => {
  // Only notice user when they checked manually
  if (!silentMode) {
    mainWindow.send('update-not-available');
  }
});

// Update Error
if (autoUpdater) autoUpdater.on('error', error => {
  let errMessage;
  if (error == null) {
    errMessage = 'Unknown Error';
  } else {
    errMessage = error.message;
  };
  mainWindow.send('update-error', errMessage);
});

// DOWNLOADING UPDATE EVENTS
// Download Progress
if (autoUpdater) autoUpdater.on('download-progress', progressObj => {
  mainWindow.send('update-download-progress', progressObj.percent);
});

// Update Downloaded
if (autoUpdater) autoUpdater.on('update-downloaded', info => {
  mainWindow.send('update-downloaded', info);
});

// Main Function
function checkForUpdate() {
  // Only check for update in Production
  if (autoUpdater && !isDev) {
    autoUpdater.checkForUpdates();
  }
}

// Check for update on Startup
checkForUpdate();

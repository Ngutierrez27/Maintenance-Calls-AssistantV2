const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater }   = require('electron-updater');
const path             = require('path');


let mainWindow;

function createWindow () {
 mainWindow = new BrowserWindow({
   width: 800,
   height: 800,
   webPreferences: {
     preload: path.join(__dirname, 'preload.js'), // 👈 now points to preload.js
     contextIsolation: false,                      // 👈 allows Node access
     nodeIntegration: true                         // 👈 allows clipboard and other modules
   }
 });

 mainWindow.loadFile('index.html');

 // Right-click menu: Copy / Cut / Paste / Select All
 mainWindow.webContents.on('context-menu', (event, params) => {
   const menu = Menu.buildFromTemplate([
     { role: 'cut',    enabled: params.editFlags.canCut },
     { role: 'copy',   enabled: params.editFlags.canCopy },
     { role: 'paste',  enabled: params.editFlags.canPaste },
     { type: 'separator' },
     { role: 'selectAll' }
   ]);
   menu.popup({ window: mainWindow });
 });
}


app.whenReady().then(createWindow);
// Only check for updates in packaged app (not during `npm start`)
if (app.isPackaged) {
  autoUpdater.checkForUpdatesAndNotify();
}

// (optional) basic logging to help you see what’s happening
autoUpdater.on('checking-for-update', () => console.log('Updater: checking-for-update'));
autoUpdater.on('update-available',  () => { console.log('Updater: update-available'); mainWindow?.webContents.send('update-available'); });
autoUpdater.on('update-not-available', () => console.log('Updater: update-not-available'));
autoUpdater.on('error', err => console.error('Updater error:', err));
autoUpdater.on('download-progress', p => console.log(`Download ${Math.round(p.percent)}%`));
autoUpdater.on('update-downloaded', () => {
  console.log('Updater: update-downloaded, installing…');
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
const { app, BrowserWindow, Menu, dialog } = require('electron');
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

function buildAppMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    // macOS app menu
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),

    // Edit menu (standard)
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' },
        { type: 'separator' }, { role: 'selectAll' }
      ]
    },

    // View menu (handy while testing)
    {
      label: 'View',
      submenu: [
        { role: 'reload' }, { role: 'toggleDevTools' }, { type: 'separator' },
        { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' }, { role: 'togglefullscreen' }
      ]
    },

    // Help menu with "Check for Updates…"
    {
      label: 'Help',
      submenu: [
        {
          label: 'Check for Updates…',
          click: async () => {
            if (!app.isPackaged) {
              await dialog.showMessageBox({
                type: 'info',
                message: 'Dev mode: updates are disabled.'
              });
              return;
            }
            try {
              await autoUpdater.checkForUpdates(); // kicks off download if available
              await dialog.showMessageBox({
                type: 'info',
                message: 'Checking for updates…'
              });
            } catch (err) {
              await dialog.showMessageBox({
                type: 'error',
                message: `Update check failed: ${err.message}`
              });
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  buildAppMenu();
  // Only check for updates in packaged app (not during `npm start`)
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

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
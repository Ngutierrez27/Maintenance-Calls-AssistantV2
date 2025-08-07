const { app, BrowserWindow } = require('electron');
const path = require('path');


function createWindow () {
 const win = new BrowserWindow({
   width: 800,
   height: 800,
   webPreferences: {
     preload: path.join(__dirname, 'renderer.js'), // 👈 makes sure renderer runs
     contextIsolation: false,                      // 👈 allows Node access
     nodeIntegration: true                         // 👈 allows clipboard and other modules
   }
 });


 win.loadFile('index.html');
}


app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
 if (process.platform !== 'darwin') app.quit();
});


app.on('activate', () => {
 if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

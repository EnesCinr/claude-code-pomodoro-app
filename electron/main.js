const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, '../public/icon.png')
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
  
  // If default port is not available, try the next ones
  mainWindow.loadURL('http://localhost:5173')
    .catch(() => mainWindow.loadURL('http://localhost:5174'))
    .catch(() => mainWindow.loadURL('http://localhost:5175'))
    .catch(() => mainWindow.loadURL('http://localhost:5176'))
    .catch(() => mainWindow.loadURL('http://localhost:5177'))
    .catch(error => {
      console.error('Failed to load app on any port', error);
      if (isDev) {
        mainWindow.loadURL(`file://${path.join(__dirname, '../index.html')}`);
      }
    });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
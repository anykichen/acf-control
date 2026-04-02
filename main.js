const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// 允许自签名证书（用于开发环境）
app.commandLine.appendSwitch('ignore-certificate-errors');

const CONFIG_FILE = path.join(app.getPath('userData'), 'config.json');

let mainWindow;
let config = {};

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      config = JSON.parse(data);
    }
  } catch (err) {
    console.error('加载配置失败:', err);
    config = {};
  }
  return config;
}

function saveConfig(newConfig) {
  try {
    config = { ...config, ...newConfig };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('保存配置失败:', err);
    return false;
  }
}

function createWindow() {
  const cfg = loadConfig();
  
  if (!cfg.serverUrl) {
    createConfigWindow();
    return;
  }
  
  if (!cfg.user || !cfg.rememberMe) {
    createLoginWindow();
    return;
  }
  
  createMainWindow();
}

function createConfigWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 350,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });
  
  mainWindow.loadFile('pages/config.html');
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createLoginWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });
  
  mainWindow.loadFile('pages/login.html');
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 600,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });
  
  mainWindow.loadFile('pages/index.html');
  
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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('get-config', () => {
  return loadConfig();
});

ipcMain.handle('save-config', (event, newConfig) => {
  return saveConfig(newConfig);
});

ipcMain.handle('login-success', (event, user) => {
  saveConfig({ user });
  if (mainWindow) {
    mainWindow.close();
  }
  createMainWindow();
});

ipcMain.handle('logout', () => {
  saveConfig({ user: null, rememberMe: false });
  if (mainWindow) {
    mainWindow.close();
  }
  createLoginWindow();
});

ipcMain.handle('change-server', () => {
  if (mainWindow) {
    mainWindow.close();
  }
  createConfigWindow();
});

ipcMain.handle('play-sound', (event, type) => {
  if (mainWindow) {
    mainWindow.webContents.send('play-sound', type);
  }
});

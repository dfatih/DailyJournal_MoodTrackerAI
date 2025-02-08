// main.js
require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');
const path = require('path');
const { app, BrowserWindow } = require('electron');

// Logging function for main process
function log(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  const logPath = path.join(__dirname, 'app.log');
  fs.appendFile(logPath, logMessage, err => {
    if (err) console.error("Error writing to log file:", err);
  });
}

function createWindow() {
  log("Creating main window.");
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,   // For simplicity in this demo
      contextIsolation: false  // Allow renderer process to access Node modules
    }
  });
  win.setMenuBarVisibility(false); // Hides the menu bar
  // win.removeMenu(); // Completely removes the menu bar
  win.loadFile('index.html').catch(err => {
    log("Error loading index.html: " + err);
  });
}

app.whenReady().then(() => {
  log("App is ready.");
  createWindow();
});

app.on('window-all-closed', () => {
  log("All windows closed.");
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

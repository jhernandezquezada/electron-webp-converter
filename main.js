const { app, BrowserWindow, ipcMain,shell } = require('electron');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

function createWindow() {
    let iconPath = path.join(__dirname, 'assets', 'icon.icns');
    
    // Check if the icon file exists
    if (!fs.existsSync(iconPath)) {
      console.warn(`Icon file not found: ${iconPath}`);
      iconPath = null;  // Set to null if file doesn't exist
    }
  
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: process.env.NODE_ENV !== 'production' // Only enable DevTools in development
      },
      icon: iconPath  // This will be null if the file doesn't exist
    });
  

  win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
  
    if (process.platform === 'darwin') {
      const iconPath = path.join(__dirname, 'assets', 'icon.icns');
      if (fs.existsSync(iconPath)) {
        app.dock.setIcon(iconPath);
      } else {
        console.warn(`Dock icon file not found: ${iconPath}`);
      }
    }
  });

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

ipcMain.on('convert-to-webp', (event, filePath) => {
    const outputPath = filePath.replace(/\.[^/.]+$/, "") + '.webp';
    
    sharp(filePath)
      .webp()
      .toFile(outputPath)
      .then(() => {
        event.reply('conversion-complete', outputPath);
        // Open the folder containing the converted file
        shell.showItemInFolder(outputPath);
      })
      .catch(err => {
        event.reply('conversion-error', err.message);
      });
  });
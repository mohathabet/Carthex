const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Must be false for `window.require('electron')`
    },
  });

  mainWindow.loadURL('http://localhost:3000'); // or loadFile if you're not using a dev server

  // PDF Export listener
  ipcMain.on('print-to-pdf', async (event, data) => {
    const filePath = dialog.showSaveDialogSync(mainWindow, {
      title: 'Enregistrer le fichier PDF',
      defaultPath: `tva-${data.year}-T${data.trimestre}.pdf`,
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
    });

    if (!filePath) return; // User canceled

    try {
      const pdf = await mainWindow.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        landscape: false,
      });

      fs.writeFileSync(filePath, pdf);
      console.log('✅ PDF saved to:', filePath);
    } catch (err) {
      console.error('❌ Failed to save PDF:', err);
    }
  });
}

app.whenReady().then(createWindow);

// Quit when all windows are closed
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
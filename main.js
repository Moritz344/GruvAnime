
const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  if (process.env.ELECTRON_DEV) {
    win.loadURL("http://localhost:4200/");
    //win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(app.getAppPath(), 'dist/anime-list/browser/index.html'));
  }

}

ipcMain.handle("open-external", async (_, url) => {
  await shell.openExternal(url);
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});



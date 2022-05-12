// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const discordrpc = require("discord-rpc");

function createWindow() {
  let iconext = "png";
  switch (process.platform) {
    case "win32":
      iconext = "ico";
      break;
    case "darwin":
      iconext = "icns";
      break;
  };
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: `./icon/.${iconext}`
  });

  // and load the index.html of the app.
  mainWindow.loadURL("https://tankionline.com/play/");
  mainWindow.setMenuBarVisibility(true);
  mainWindow.maximize();
  mainWindow.setFullScreen(true);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.commandLine.appendSwitch("disable-frame-rate-limit");
  app.commandLine.appendSwitch("disable-gpu-vsync");

  rpc.login({ clientId: "974379405629591572" }).catch(console.error).then(c => {
    c.setActivity({
      startTimestamp: Date.now(),
      largeImageKey: "icon",
      largeImageText: "Tanki Online",
      instance: false
    });
  });

  app.on("activate", function () {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const rpc = new discordrpc.Client({ transport: "ipc" });

app.on("window-all-closed" && "quit", async () => {
  await rpc.clearActivity();
  rpc.destroy();
});

ipcMain.handle("rpc-handler", (event, activity) => {
  rpc.setActivity(activity).catch(console.error);
});
const { app, BrowserWindow, ipcMain, Notification, shell } = require("electron")
const path = require("path")

const createWindow = () => {
    const win = new BrowserWindow({
        width: 360,
        height: 280,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    win.loadFile(path.join(__dirname, "index.html"))
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    ipcMain.on("notify", (_, msg) => {
        new Notification({
            title: msg.title,
            body: msg.body
        }).show()
        shell.beep()
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit()
})

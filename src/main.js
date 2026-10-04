const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, Notification, shell, powerSaveBlocker } = require("electron")
const path = require("path")

let win = null
let tray = null
let blockerId = null
let isQuitting = false

const createWindow = () => {
    win = new BrowserWindow({
        width: 360,
        height: 280,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    win.loadFile(path.join(__dirname, "index.html"))
    win.on("blur", () => win.hide())
    win.on("close", (e) => {
        if (!isQuitting) {
            e.preventDefault()
            win.hide()
        }
    })
}

const createTray = () => {
    const icon = nativeImage.createFromPath(path.join(__dirname, "..", "assets", "icon.png"))
    icon.setTemplateImage(true)
    tray = new Tray(icon)
    tray.setToolTip("Lull")
    const menu = Menu.buildFromTemplate([{
        label: "Quit",
        role: "quit"
    }])
    tray.on("click", () => {
        if (!win || win.isDestroyed())
            createWindow()
        else
            win.isVisible() ? win.hide() : win.show()
    })
    tray.on("right-click", () => tray.popUpContextMenu(menu))
}

app.whenReady().then(() => {
    app.dock?.hide()
    createWindow()
    createTray()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })

    ipcMain.on("notify", (_, msg) => {
        new Notification({
            title: msg.title,
            body: msg.body
        }).show()
        shell.beep()
    })

    ipcMain.on("awake", (_, enable) => {
        if (enable && blockerId === null)
            blockerId = powerSaveBlocker.start("prevent-display-sleep")
        else if (!enable && blockerId !== null) {
            powerSaveBlocker.stop(blockerId)
            blockerId = null
        }
    })
})

app.on("before-quit", () => isQuitting = true)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        app.quit()
})

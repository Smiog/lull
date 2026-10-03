const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
    notify: (msg) => ipcRenderer.send("notify", msg)
})

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeWindow: () => ipcRenderer.invoke('window:close'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  onUpdateReady: (callback) => ipcRenderer.on('update:ready', () => callback()),
  getVersion: () => ipcRenderer.invoke('app:getVersion')
});

const { app, BrowserWindow,ipcMain } = require('electron')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })
  win.loadURL('http://localhost:3000/')
  win.on('closed', function () {
    win = null
  })
  win.webContents.openDevTools();
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin' ) {
    app.quit()
  }
})

ipcMain.on('reqaction', (event, arg) => {
  switch(arg){
    case 'exit':
      safeExit=true;
      app.quit();//退出程序
      break;
    case 'addDb':
      console.log(arg)
      break;
  }
});
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const jsonStorage = require('electron-json-storage')
const storeKey = 'dbList'
const handleAction = require('./main/action')
const mongoAction = require('./main/mongoAction')
const isDev = process.env.NODE_ENV !== 'production'
const HOST=isDev?'localhost:3000/':''
global.shared = {
  dbClient:{},
  dbList: {}
}
let win = null
jsonStorage.get(storeKey, (err, data) => {
  global.shared.dbList = data
  if (win) {
    win.webContents.send('reloadDb', data)
  }
})

const menuTemplate = [
  {
    label: '文件',
    submenu: [
      {
        label: '新建连接',
        click() {
          openWin('http://'+HOST+'#/database/add')
        }
      },
      { type: 'separator' },
      { role: 'close' }
    ]
  },
  {
    label: '关于',
    click() {
      openWin('http://'+HOST+'/#/about')
    }
  }
]

function openWin(url) {
  let newWin = new BrowserWindow({
    show: false,
    parent: win,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    }
  })
  newWin.once('ready-to-show', () => {
    newWin.show()
  })
  newWin.loadURL(url)
  isDev && newWin.webContents.openDevTools()
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  win.loadURL('http://'+HOST)
  win.on('closed', function () {
    win = null
  })
  if (isDev) {
    win.webContents.openDevTools();
  } else {
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const handleError = (err, event) => {
  event.sender.send('notify', {
    message: err
  })
}
ipcMain.on('reqaction', (event, arg) => {
  const { action } = arg
  const relaodDb = function (err) {
    if (err) {
      win.webContents.send('notify', { message: err.message })
    } else {
      event.sender.send('resaction', { action, status: true })
      win.webContents.send('reloadDb', global.shared.dbList)
    }
  }
  handleAction({ event, arg, openWin, relaodDb, handleError, jsonStorage, storeKey })[action]()
})
ipcMain.on('mongoReq', (event, arg) => {
  const { action } = arg
  mongoAction({ event, arg,handleError })[action]()
})
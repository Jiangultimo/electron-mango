const { app, BrowserWindow, ipcMain,Menu } = require('electron')
const jsonStorage = require('electron-json-storage')
const storeKey='dbList'
global.shared = {
  dbList:{}
}
let win=null
jsonStorage.get(storeKey,(err, data)=>{
  global.shared.dbList = data
  if (win){
    win.webContents.send('reloadDb',data)
  }
})

const menuTemplate=[
  {
    label:'文件',
    submenu:[
      {
        label:'新建连接',
        click () {
          openWin('http://localhost:3000/#/database/add')
        }
      },
      { type: 'separator' },
      { role: 'close' }
    ]
  },
  {
    label:'关于',
    click () {
      openWin('http://localhost:3000/#/about')
    }
  }
]

function openWin(url) {
  let newWin=new BrowserWindow({ show: false,parent: win, autoHideMenuBar: true })
  newWin.once('ready-to-show', () => {
    newWin.show()
  })
  newWin.loadURL(url)
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 720
  })
  win.loadURL('http://localhost:3000/')
  win.on('closed', function () {
    win = null
  })
  win.webContents.openDevTools();
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('reqaction', (event, arg) => {
  const { action } = arg
  switch (action) {
    case 'exit':
      safeExit = true
      app.quit() //退出程序
      break
    case 'addDb':
      if (arg.name in global.shared.dbList){
        event.sender.send('resaction', {action,status:false,info:'此连接已存在！'})
      }else{
        global.shared.dbList[arg.name]=arg.uri
        jsonStorage.set(storeKey,global.shared.dbList,(err)=>{
          if (err){
            console.log(err)
          }else{
            event.sender.send('resaction', {action,status:true})
            win.webContents.send('reloadDb',global.shared.dbList)
          }
        })
      }
      break
  }
})
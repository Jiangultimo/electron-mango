const { MongoClient } = require('mongodb')

module.exports = ({
  event,
  arg,
  openWin,
  relaodDb,
  handleError,
  jsonStorage,
  storeKey
}) => ({
  'exit'() {
    safeExit = true
    app.quit() //退出程序
  },
  'delDb'() {
    if (arg.name in global.shared.dbList) {
      delete global.shared.dbList[arg.name]
      jsonStorage.set(storeKey, global.shared.dbList, relaodDb)
    } else {
      event.sender.send('notify', { message: '此连接已删除！' })
    }
  },
  'editDb'() {
    if (arg.key in global.shared.dbList) {
      delete global.shared.dbList[arg.key]
      global.shared.dbList[arg.name] = arg.uri
      jsonStorage.set(storeKey, global.shared.dbList, relaodDb)
    } else {
      event.sender.send('notify', { message: '此连接已被修改！' })
    }
  },
  'addDb'() {
    if (arg.name in global.shared.dbList) {
      event.sender.send('notify', { message: '此连接已存在！' })
    } else {
      global.shared.dbList[arg.name] = arg.uri
      jsonStorage.set(storeKey, global.shared.dbList, relaodDb)
    }
  },
  'showAddDb'() {
    if ('name' in arg) {
      openWin(`http://localhost:3000/#/database/edit/${arg['name']}`)
    } else {
      openWin('http://localhost:3000/#/database/add')
    }
  },
  'getCollects'(){
    console.log('fuck');
    
    const client=global.shared.dbClient[arg.link]
    client.db(arg.db).collections()
    .then((val)=>{
      arg.data=val
      event.sender.send('mongoRes', arg)
    })
  },
  'connect'() {
    const { name } = arg
    const { dbList } = global.shared
    const client = new MongoClient(dbList[name], { useNewUrlParser: true })
    client.connect((err) => {
      if(err) {
        handleError(err, event)
        return false
      }
      let dbName='admin'
      let str=dbList[name].substr(11)
      var i = str.indexOf('/')+1
      if (i>0){
        if (str.indexOf('?')>0){
          dbName=str.substring(i,str.indexOf('?'))
        }else dbName=str.substring(i)
      }
      // Use the admin database for the operation
      const adminDB = client.db(dbName).admin()
      // List all the available databases
      adminDB.listDatabases()
      .then((res) => {
        event.sender.send('connected', { name, dbs: res.databases })
      })
      .catch(() => {
        client.db(dbName).stats()
        .then((val) => {
          let allDBs=[{'name':val.db,'sizeOnDisk':val.dataSize}]
          event.sender.send('connected', { name, dbs: allDBs })
        })
      })
      global.shared.dbClient[name]=client
    })
  }
})
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
    const { shared: { dbList } } = global
    if (arg.name in dbList) {
      delete dbList[arg.name]
      jsonStorage.set(storeKey, dbList, relaodDb)
    } else {
      event.sender.send('notify', { message: '此连接已删除！' })
    }
  },
  'editDb'() {
    const { shared: { dbList } } = global
    if (arg.key in dbList) {
      delete dbList[arg.key]
      dbList[arg.name] = arg.uri
      jsonStorage.set(storeKey, dbList, relaodDb)
    } else {
      event.sender.send('notify', { message: '此连接已被修改！' })
    }
  },
  'addDb'() {
    const { shared: { dbList } } = global
    if (arg.name in dbList) {
      event.sender.send('notify', { message: '此连接已存在！' })
    } else {
      dbList[arg.name] = arg.uri
      jsonStorage.set(storeKey, dbList, relaodDb)
    }
    event.sender.send('added', dbList)
  },
  'showAddDb'() {
    if ('name' in arg) {
      openWin(`http://localhost:3000/#/database/edit/${arg['name']}`)
    } else {
      openWin('http://localhost:3000/#/database/add')
    }
  },
  'connect'() {
    const { shared: { dbList, dbClient } } = global
    const { name } = arg
    const client = new MongoClient(dbList[name], { useNewUrlParser: true })
    client.connect((err) => {
      if (err) {
        handleError(err, event)
        return false
      }
      let dbName = 'admin'
      let str = dbList[name].substr(11)
      var i = str.indexOf('/') + 1
      if (i > 0) {
        if (str.indexOf('?') > 0) {
          dbName = str.substring(i, str.indexOf('?'))
        } else dbName = str.substring(i)
      }
      // Use the admin database for the operation
      const adminDB = client.db(dbName).admin()
      // List all the available databases
      adminDB.listDatabases()
        .then((res) => {
          event.sender.send('connected', { name, dbs: res.databases })
        })
        .catch(() => {
          //for mongodb<4.0, cannot use admin()
          client.db(dbName).stats()
            .then((val) => {
              let allDBs = [{ 'name': val.db, 'sizeOnDisk': val.dataSize }]
              event.sender.send('connected', { name, dbs: allDBs })
            })
        })
      dbClient[name] = client
    })
  }
})

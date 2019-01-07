const { MongoClient } = require('mongodb')

const handleError = (err, event) => {
  event.sender.send('notify', {
    message: err
  })
}
module.exports = ({
  event,
  arg,
  openWin,
  relaodDb,
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
  'connect'() {
    const { name = 'admin' } = arg
    const { dbList } = global.shared
    const client = new MongoClient(dbList[name], { useNewUrlParser: true })
    client.connect(async (err) => {
      if(err) {
        handleError(err, event)
        return false
      }
      // Use the admin database for the operation
      const adminDB = client.db(name).admin()
      // List all the available databases
      const allDBs = await adminDB.listDatabases()
      event.sender.send('connected', { dbs: allDBs })
      client.close()
    })
  }
})
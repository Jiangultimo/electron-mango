const { ObjectID,MongoClient } = require('mongodb')
const { serialize, parse } = require('mongodb-extended-json')
module.exports = ({
  event,
  arg,
  handleError
}) => ({
  addItem() {
    const client = global.shared.dbClient[arg.link]
    const table = client.db(arg.db).collection(arg.collect)
    table.insertOne(arg.data)
      .then((_, data) => {
        arg.data = data
        event.sender.send('mongoRes', arg)
      })
      .catch((e) => {
        handleError(e.toString(), event)
      })
  },
  mod() {
    const client = global.shared.dbClient[arg.link]
    const table = client.db(arg.db).collection(arg.collect)
    table.updateOne({ '_id': ObjectID(arg.data.id) }, { '$set': parse(arg.data.data) })
      .then((data) => {
        arg.data = {}
        event.sender.send('mongoRes', arg)
      })
      .catch((e) => {
        handleError(e.toString(), event)
      })
  },
  modMany() {
    const client = global.shared.dbClient[arg.link]
    const table = client.db(arg.db).collection(arg.collect)
    table.updateMany(arg.data[0], arg.data[1])
      .then((data) => {
        arg.data = `匹配到${data.matchedCount}条数据，修改${data.modifiedCount}条数据`
        event.sender.send('mongoRes', arg)
      })
      .catch((e) => {
        handleError(e.toString(), event)
      })
  },
  del() {
    const client = global.shared.dbClient[arg.link]
    const table = client.db(arg.db).collection(arg.collect)
    table.deleteOne({ '_id': ObjectID(arg.data) })
      .then((data) => {
        arg.data = data.deletedCount
        event.sender.send('mongoRes', arg)
      })
      .catch((e) => {
        handleError(e.toString(), event)
      })
  },
  deleteMany() {
    const client = global.shared.dbClient[arg.link]
    const table = client.db(arg.db).collection(arg.collect)
    table.deleteMany(arg.data[0])
      .then((data) => {
        arg.data = `成功删除${data.deletedCount}条数据`
        event.sender.send('mongoRes', arg)
      })
      .catch((e) => {
        handleError(e.toString(), event)
      })
  },
  find() {
    const client = global.shared.dbClient[arg.link]
    const table = client.db(arg.db).collection(arg.collect)
    let fitter = arg.data.fitter
    delete arg.data.fitter
    table.find(fitter, arg.data)
      .toArray()
      .then((data) => {
        arg.data = { 'data': data.map((v) => serialize(v)) }
        return table.countDocuments(fitter, { maxTimeMS: 10000 })
      })
      .then((res) => {
        arg.data.total = res
        event.sender.send('mongoRes', arg)
      })
      .catch((e) => {
        handleError(e.toString(), event)
      })
  },
  tryConntect() {
    var client = new MongoClient(arg.data, { useNewUrlParser: true })
    client.connect((err) => {
      if (err != null) {
        handleError(err.message, event)
        return false
      } else {
        client.close()
        event.sender.send('mongoRes', arg)
      }
    })
  },
  getCollects() {
    const client = global.shared.dbClient[arg.link]
    client.db(arg.db).collections()
      .then((val) => {
        let pro = val.map(async (i) => {
          var info = await i.stats()
          return {
            name: i.collectionName,
            count: info.count,
            sizeOnDisk: info.size,
            totalIndexSize: info.totalIndexSize
          }
        })
        Promise.all(pro)
          .then((res) => {
            arg.data = res
            event.sender.send('mongoRes', arg)
          })
      })
  }
})
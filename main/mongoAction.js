module.exports = ({
  event,
  arg,
  handleError
}) => ({
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
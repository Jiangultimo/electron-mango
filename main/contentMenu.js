module.exports = ({
  event,
  arg,
  handleError
}) => ({
  'getCollects'(){
    const client=global.shared.dbClient[arg.link]
    client.db(arg.db).collections()
    .then((val)=>{
      arg.data=val.map((i)=>{
        return i.s.name
      })
      event.sender.send('mongoRes', arg)
    })
  }
})
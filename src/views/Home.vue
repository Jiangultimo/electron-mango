<template>
  <div class="home">
    <div id="connected">
      <div v-for="(obj,name) in connected" :key="name">
        <p>{{name}}</p>
        <ul>
          <li v-for="db in obj.dbs" :key="db.name">{{db.name}} {{db.sizeOnDisk}}Byte</li>
        </ul>
      </div>
    </div>
    <div id="connectiong">
      <ul>
        <li v-for="(uri,name) in dbList" :key="name" @dblclick="connect(name)">{{name}}</li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
import mongoUri from '@/utils/MongoUri'
const { remote, ipcRenderer } = window.require('electron')
const { MongoClient } = window.require('mongodb')

export default {
  name: 'home',
  data () {
    return {
      connected: {},
      dbList: {}
    }
  },
  methods: {
    connect (name) {
      if (name in this.connected) return // 已经连接了
      var client = new MongoClient(this.dbList[name], { useNewUrlParser: true })
      client.connect((err) => {
        if (err != null) {
          this.$message.error(err.message)
          return false
        } else {
          this.$mongo[name] = client
          var dbName = mongoUri.parser(this.dbList[name]).database
          this.$set(this.connected, name, {
            admin: client.db(dbName).admin(),
            dbs: []
          })
          this.connected[name].admin.listDatabases()
            .then((dbs) => {
              this.connected[name].dbs = dbs.databases
            })
        }
      })
    }
  },
  created () {
    this.dbList = remote.getGlobal('shared').dbList
    ipcRenderer.on('reloadDb', (event, arg) => {
      this.dbList = arg
      for (const x in this.connected) {
        if (!this.dbList.hasOwnProperty(x)) {
          delete this.connected[x]
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
.home{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
}
</style>

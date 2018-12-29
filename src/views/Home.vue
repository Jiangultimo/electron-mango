<template>
  <div class="home">
    <div id="connected">
      <div v-for="(obj,name) in connected" :key="name">
        <p>{{name}}</p>
        <ul>
          <li v-for="db in obj.dbs" :key="db.name">
            <span @dblclick="getCollect(name,db.name)">{{db.name}}</span> {{db.sizeOnDisk}}Byte
            <div>
              <ul>
                <li v-for="collect in db.collects" :key="collect.name">
                  {{name}}
                  <el-button type="primary" @click="editConnect(name)">编辑</el-button>
                  <el-button type="danger" @click="delConnect(name)">删除</el-button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="connectiong">
      <el-button type="primary" @click="newConnect">新建连接</el-button>
      <ul>
        <li v-for="(uri,name) in dbList" :key="name" @dblclick="connect(name)">
          {{name}}
          <el-button type="primary" @click="editConnect(name)">编辑</el-button>
          <el-button type="danger" @click="delConnect(name)">删除</el-button>
        </li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
import mongoUri from '@/utils/MongoUri'
const { remote, ipcRenderer } = window.require('electron')
const { MongoClient } = window.require('mongodb')

class DbInfo {
  constructor (obj) {
    this.name = obj.name
    this.sizeOnDisk = obj.sizeOnDisk
    this.collects = []
  }
}

export default {
  name: 'home',
  data () {
    return {
      connected: {},
      dbList: {}
    }
  },
  methods: {
    newConnect () {
      ipcRenderer.send('reqaction', { action: 'showAddDb' })
    },
    delConnect (name) {
      ipcRenderer.send('reqaction', { action: 'delDb', name })
    },
    editConnect (name) {
      ipcRenderer.send('reqaction', { action: 'showAddDb', name })
    },
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
              this.connected[name].dbs = dbs.databases.map(i => new DbInfo(i))
              console.log(this.connected[name].dbs)
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
    ipcRenderer.on('notify', (event, arg) => {
      this.$message({
        type: arg.type || 'error',
        message: arg.message
      })
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

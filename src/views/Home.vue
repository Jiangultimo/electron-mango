<template>
  <div class="home">
    <div id="connected">我会显示已经连接的数据库</div>
    <div id="connectiong">
      <ul>
        <li v-for="(uri,name) in dbList" :key="name" @dblclick="connect(name)">{{name}}</li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
const { remote, ipcRenderer } = window.require('electron')
const MongoClient = window.require('mongodb')
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
      client.connect(function (err) {
        if (err != null) {
          console.log(err)
          return false
        } else {
          this.connected[name] = {
            obj: client,
            dbs: []
          }
        }
      })
    }
  },
  created () {
    this.dbList = remote.getGlobal('shared').dbList
    ipcRenderer.on('reloadDb', (event, arg) => {
      this.dbList = arg
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

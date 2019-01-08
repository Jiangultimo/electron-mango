<template>
  <div class="home">
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

<script lang="ts">
import { Vue, Component, Provide } from 'vue-property-decorator'
const { remote, ipcRenderer } = window.require('electron')
const { MongoClient } = window.require('mongodb')

class DbInfo {
  public name: string
  public sizeOnDisk: any
  public collects: any[]
  constructor (obj: any) {
    this.name = obj.name
    this.sizeOnDisk = Number(obj.sizeOnDisk) / 1024
    this.collects = []
  }
}

interface Payload {
  linkName: string,
  linkAddr: string,
  dbs: any[]
}

@Component
export default class Home extends Vue {
  // data
  connected: any = {}
  dbList: any = {}

  // methods
  newConnect () {
    ipcRenderer.send('reqaction', { action: 'showAddDb' })
  }
  delConnect (name: string): void {
    ipcRenderer.send('reqaction', { action: 'delDb', name })
  }
  editConnect (name: string): void {
    ipcRenderer.send('reqaction', { action: 'showAddDb', name })
  }
  connect (name: string): void {
    if (name in this.connected) {
      return // 已经连接了
    }
    ipcRenderer.send('reqaction', {
      action: 'connect',
      name
    })
    ipcRenderer.on('connected', (event: any, arg: any) => {
      const { ok, totalSize, databases } = arg.dbs
      if( ok == 1) {
        this.$set(this.connected, name, {
          dbs: []
        })
        this.connected[name].dbs = databases.map(function(db: Object): Object {
          return new DbInfo(db)
        })
        const payload: Payload = {
          linkName: name,
          linkAddr: remote.getGlobal('shared').dbList[name],
          dbs:  this.connected[name].dbs
        }
        this.$store.dispatch({
          type: 'setDBs',
          payload: payload
        })
      }
    })
  }

  created () {
    this.dbList = remote.getGlobal('shared').dbList
    ipcRenderer.on('reloadDb', (event: any, arg: IArguments) => {
      this.dbList = arg
      for (const key in this.connected) {
        if (!this.dbList.hasOwnProperty(key)) {
          delete this.connected[key]
        }
      }
    })
    ipcRenderer.on('notify', (event: any, arg: any) => {
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
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  // font-size: 48px;
}
</style>

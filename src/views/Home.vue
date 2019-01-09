<template>
  <div class="home">
    <div id="connectiong">
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
import {SavedLink} from '@/type/database'
const { remote, ipcRenderer } = window.require('electron')

@Component
export default class Home extends Vue {
  dbList: SavedLink = new Map()

  // methods
  delConnect (name: string): void {
    ipcRenderer.send('reqaction', { action: 'delDb', name })
  }
  editConnect (name: string): void {
    ipcRenderer.send('reqaction', { action: 'showAddDb', name })
  }
  connect (name: string): void {
    if (name in this.$store.state.treeData) {
      return // 已经连接了
    }
    ipcRenderer.send('reqaction', {
      action: 'connect',
      name
    })
  }

  created () {
    this.dbList = remote.getGlobal('shared').dbList
    ipcRenderer.on('reloadDb', (event: any, arg: SavedLink) => {
      this.dbList = arg
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
</style>

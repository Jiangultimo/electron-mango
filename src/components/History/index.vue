<template>
<div class="history">
  <h4>已存连接</h4>
  <li v-for="(uri,name) in dbList" :key="name" @dblclick="connect(name)">
    {{name}}
    <el-button type="primary" @click="editConnect(name)">编辑</el-button>
    <el-button type="danger" @click="delConnect(name)">删除</el-button>
  </li>
</div>
</template>

<script lang="ts">
const { remote } = window.require('electron')
import { Vue, Component } from 'vue-property-decorator'
import {SavedLink} from '@/type/database'
@Component
export default class History extends Vue {
  dbList: SavedLink = new Map()
  delConnect (name: string): void {
    this.$ipc.send('reqaction', { action: 'delDb', name })
  }
  editConnect (name: string): void {
    this.$ipc.send('reqaction', { action: 'showAddDb', name })
  }
  connect (name: string): void {
    if (name in this.$store.state.treeData) {
      return // 已经连接了
    }
    this.$ipc.send('reqaction', {
      action: 'connect',
      name
    })
  }

  created () {
    this.dbList = remote.getGlobal('shared').dbList
    this.$ipc.on('reloadDb', (event: any, arg: SavedLink) => {
      this.dbList = arg
    })
  }
}
</script>

<style lang="less" scoped>
.history{
  width: 100%;
  box-sizing: border-box;
  h4{
    text-align: center;
    margin: 10px 0;
  }
}
</style>

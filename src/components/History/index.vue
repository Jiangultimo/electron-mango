<template>
  <div class="history">
    <h4>已存连接</h4>
    <ul>
      <li v-for="(uri,name) in dbList" :key="name" @dblclick="connect(name)" class="history-item">
        <span class="history-item-name">{{name}}</span>
        <div>
          <i class="el-icon-edit" @click="editConnect(name)"></i>
          <i class="el-icon-delete" @click="delConnect(name)"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
const {
  remote
} = window.require('electron')
import {
  Vue,
  Component
} from 'vue-property-decorator'
import {
  SavedLink
} from '@/type/database'
@Component
export default class History extends Vue {
  dbList: SavedLink = new Map()
  delConnect(name: string): void {
    this.$ipc.send('reqaction', {
      action: 'delDb',
      name
    })
  }
  editConnect(name: string): void {
    this.$ipc.send('reqaction', {
      action: 'showAddDb',
      name
    })
  }
  connect(name: string): void {
    if (name in this.$store.state.db.treeData) {
      return // 已经连接了
    }
    this.$ipc.send('reqaction', {
      action: 'connect',
      name
    })
  }

  created() {
    this.dbList = remote.getGlobal('shared').dbList
    this.$ipc.on('reloadDb', (event: any, arg: SavedLink) => {
      this.dbList = arg
    })
  }
}
</script>

<style lang="less" scoped>
.history {
  width: 100%;
  box-sizing: border-box;
  ul {
    margin: 0;
    padding: 0;
  }
  h4 {
    text-align: center;
    margin: 10px 0;
  }
}
.history-item {
  display: flex;
  justify-content: space-between;
  span,
  i {
    margin-right: 10px;
  }
  i {
    cursor: pointer;
  }
}
</style>

<template>
  <div class="connected">
    <h4>已链接</h4>
    <el-tree
      :data="dbs"
      node-key="id"
      @node-click="click"
      :props="defaultProps">
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Link,TreeType } from '@/type/database';
const { ipcRenderer } = window.require('electron')
@Component
export default class ConnectTree extends Vue {
  dbs: Array<Link> = []
  defaultProps: Object = {
    children: 'child',
    label: 'name',
    isLeaf: (data:any,node:any)=>{
      return false
    }
  }
  @Watch('treeTrance',{
    immediate: true,
    deep: true
  })
  onAllDBsChange() {
    this.dbs = [...this.$store.state.treeData.values()]
  }
  get treeTrance () {
    return this.$store.state.treeTrance
  }
  click(data:any,node:any){

  }
  created(){
    ipcRenderer.on('connected', (event: any, arg: any) => {
      this.$store.commit('ADD_DB',arg)
    })
  }
}
</script>

<style lang="less" scoped>
.connected{
  min-height: 500px;
  h4{
    text-align: center;
    margin: 0;
    margin: 10px 0;
  }
}
</style>

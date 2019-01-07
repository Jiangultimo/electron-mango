<template>
  <div class="connected">
    <h4>已链接</h4>
    <el-tree
      :data="dbs"
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"
      :props="defaultProps">
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
@Component
export default class ConnectTree extends Vue {
  dbs: any[] = []
  defaultProps: Object = {
    children: 'children',
    label: 'label'
  }
  @Watch('allDBs',{
    immediate: true,
    deep: true
  })
  onAllDBsChange(val: any[], oldVal: Object) {
    this.dbs = val
  }
  get allDBs () {
    return this.$store.state.treeData
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

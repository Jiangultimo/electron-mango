<template>
  <div class="connected">
    <h4>已链接</h4>
    <el-tree ref="tree" :data="dbs" node-key="id" @node-click="click" lazy :load="loadCollect" :props="defaultProps">
    </el-tree>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Watch
} from 'vue-property-decorator'
import {
  Link,
  TreeType,
  TreeNode,
  Collect,
  delimiter
} from '@/type/database'
import {
  mongo
} from '@/type/ipc'
import {
  TreeNode as ETreeNode
} from 'element-ui/types/tree'

@Component
export default class ConnectTree extends Vue {
  dbs: Array < Link > = []
  $refs!: {
    tree: any
  }
  defaultProps: Object = {
    children: 'child',
    label: 'name',
    isLeaf: (data: TreeNode) => {
      return data.type == TreeType.Collect
    }
  }
  @Watch('treeTrance')
  onAllDBsChange() {
    this.dbs = [...this.$store.state.treeData.values()]
    let obj = this.$refs.tree.store
    this.$nextTick(() => {
      for (const x of this.$store.state.treeData.keys()) {
        obj.getNode(x).expand()
      }
    })
  }
  get treeTrance() {
    return this.$store.state.treeTrance
  }
  click(data: TreeNode) {
    if (data.type == TreeType.Db) {

    }
  }
  loadCollect(node: ETreeNode < any, TreeNode > , resolve: Function) {
    if (node.data.type == TreeType.Link) {
      resolve(node.data.child)
    } else if (node.data.type == TreeType.Db) {
      this.$store.commit('ADD_EVENT', (data: mongo) => {
        let res = data.data.map((i: string): Collect => {
          return {
            id: data.link + delimiter + data.db + delimiter + i,
            type: TreeType.Collect,
            name: i,
            sizeOnDisk: 0
          }
        })
        resolve(res)
      })

      let arr = node.data.id.split(delimiter)
      const req: mongo = {
        action: 'getCollects',
        eventId: this.$store.state.eventId,
        link: arr[0],
        db: arr[1]
      }
      this.$ipc.send('mongoReq', req)
    } else resolve([])
  }
  mounted() {
    this.onAllDBsChange()
  }
}
</script>

<style lang="less" scoped>
.connected {
  min-height: 500px;
  border-bottom: 1px solid #e3e3e3;

  h4 {
    text-align: center;
    margin: 0;
    margin: 10px 0;
  }
}
</style>

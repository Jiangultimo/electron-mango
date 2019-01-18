<template>
  <div class="connected">
    <h4>已连接</h4>
    <el-tree
      ref="tree"
      :data="dbs"
      node-key="id"
      @node-click="click"
      :expand-on-click-node="false"
      lazy
      :load="loadCollect"
      :props="defaultProps"
    ></el-tree>
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
} from '@/type/database'
import { delimiter } from "@/utils/utils"
import {
  mongo
} from '@/type/ipc'
import {
  TreeNode as ETreeNode
} from 'element-ui/types/tree'

@Component
export default class ConnectTree extends Vue {
  dbs: Array<Link> = []
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
    this.dbs = [...this.$store.state.db.treeData.values()]
    let obj = this.$refs.tree.store
    this.$nextTick(() => {
      for (const x of this.$store.state.db.treeData.keys()) {
        obj.getNode(x).expand()
      }
    })
  }
  get treeTrance() {
    return this.$store.state.db.treeTrance
  }
  click(data: TreeNode, node: any) {
    if (data.type == TreeType.Db) {
      if (data.child) {
        this.$store.commit('ADD_TAB', { name: data.name, path: `/database/${data.id}/info` })
      } else {
        //自动触发加载、跳转
        node.expand()
      }
    } else if (data.type == TreeType.Collect) {
      this.$store.commit('ADD_TAB', { name: data.name, path: `/collection/${data.id}/info` })
    } else {
      node.expanded ? node.collapse() : node.expand()
    }
  }
  loadCollect(node: ETreeNode<any, TreeNode>, resolve: Function) {
    if (node.data.type == TreeType.Link) {
      resolve(node.data.child)
    } else if (node.data.type == TreeType.Db) {
      this.$store.commit('ADD_EVENT', {
        vueId: this._uid,
        handle: (data: mongo) => {
          let child = new Map<string, Collect>()
          for (const i of data.data) {
            child.set(i, {
              id: data.link + delimiter + data.db + delimiter + i,
              type: TreeType.Collect,
              name: i
            })
          }
          node.data.child = child
          this.$store.commit('ADD_TAB', { name: node.data.name, path: `/database/${node.data.id}/info` })
          resolve([...child.values()])
        }      })

      let arr = node.data.id.split(delimiter)
      const req: mongo = {
        action: 'getCollects',
        eventId: this.$store.state.db.eventId,
        link: arr[0],
        db: arr[1]
      }
      this.$ipc.send('mongoReq', req)
    } else resolve([])
  }
  mounted() {
    this.onAllDBsChange()
  }
  beforeDestroy() {
    this.$store.commit('OFF_EVENT', this._uid)
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

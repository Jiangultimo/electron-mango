<template>
  <el-tabs type="card" closable @tab-remove="removeTab" v-model="active">
    <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.name" :name="item.name"></el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import {
  Watch,
  Vue,
  Component
} from 'vue-property-decorator'

@Component
export default class Tabs extends Vue {
  active: string = ''
  removeTab(name: string) {
    this.$store.commit('DEL_TAB', name)
  }
  get tabs() {
    return this.$store.state.tab.tabs
  }
  @Watch('active')
  onTabChange(val: string, oldVal: string) {
    let path = '/'
    if (val != '') {
      for (const i of this.tabs) {
        if (i.name == val) {
          path = i.path
        } else if (i.name == oldVal) {
          i.path = this.$route.fullPath
        }
      }
    } //等于空代表tabs已经没了，不需要设置原标签地址
    this.$router.push(path)
  }
  @Watch('activeName')
  onStoreChange(val: string) {
    this.active = val
  }
  get activeName() {
    return this.$store.state.tab.active
  }
}
</script>

<style lang="less" scoped>
</style>

<template>
<div class="new-connected">
  <el-button type="primary" @click="newConnect">新建连接</el-button>
</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  newConnect () {
    this.$ipc.send('reqaction', { action: 'showAddDb' })
  }
}
</script>
<style lang="less" scoped>
.new-connected{
  width: 100%;
  border-bottom: 1px solid #e3e3e3;
  box-sizing: border-box;
  a{
    display: block;
    box-sizing: border-box;
    padding: 30px 20px;
    color: #666;
    text-decoration: none;
    text-align: center;
  }
}
</style>

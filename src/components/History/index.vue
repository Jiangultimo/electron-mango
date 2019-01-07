<template>
<div class="history">
  <h4>历史记录</h4>
  {{history}}
</div>
</template>

<script lang="ts">
const { remote, ipcRenderer } = window.require('electron')
import { Vue, Component } from 'vue-property-decorator'
export default class History extends Vue {
  history: any[] = []

  mounted () {
    console.log(1)
    console.log(remote.getGlobal('shared'))
    this.history = remote.getGlobal('shared').dbList
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

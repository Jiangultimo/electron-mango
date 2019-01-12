<template>
  <div class="new-connected">
    <a class="new-btn" @click="newConnect">新建连接</a>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'

@Component
export default class Home extends Vue {
  newConnect(e: any) {
    e.preventDefault()
    this.$ipc.send('reqaction', {
      action: 'showAddDb'
    })
  }
}
</script>

<style lang="less" scoped>
.new-connected {
  width: 100%;
  border-bottom: 1px solid #e3e3e3;
  box-sizing: border-box;

  .new-btn {
    display: block;
    box-sizing: border-box;
    padding: 30px 20px;
    color: #666;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
  }
}
</style>

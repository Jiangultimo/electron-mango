<template>
  <div class="about">
    <h1>This is an intro page</h1>
    <el-button @click="close">好的</el-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class About extends Vue {
  created() {
    document.title = '关于'
  }

  close() {
    window.close()
  }
}
</script>

<style lang="less" scoped>
.about{
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
}
</style>

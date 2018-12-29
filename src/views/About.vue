<template>
  <div class="about">
    <h1>This is an intro page</h1>
    <el-button @click="close">好的</el-button>
  </div>
</template>

<script>
export default {
  components: {
  },
  created () {
    document.title = '关于'
  },
  methods: {
    close () {
      window.close()
    }
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

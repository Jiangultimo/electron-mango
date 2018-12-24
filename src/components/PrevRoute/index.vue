<template>
<div class="prev">
  <el-button @click="back">返回上一页</el-button>
</div>
</template>

<script>
export default {
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.prev{
  width: 100px;
  height: 50px;
  padding: 20px;
  color: #999;
  cursor: pointer;
  position: fixed;
  top: 0;
  left: 0;
  a{
    text-decoration: none;
  }
}
</style>

<template>
<div class="prev">
  <router-link :to="prev">返回上一页</router-link>
</div>
</template>

<script>
export default {
  name: 'prevRoute',
  props: ['prev']
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

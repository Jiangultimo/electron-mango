<template>
  <div class="home">
    <my-nav></my-nav>
  </div>
</template>

<script>
import MyNav from '@/components/Nav/'
export default {
  name: 'home',
  components: {
    MyNav
  }
}
</script>

<style lang="less" scoped>
.home{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
}
</style>

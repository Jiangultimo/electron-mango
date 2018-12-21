<template>
  <div class="about">
    <prev-route :prev="'/'" />
    <h1>This is an intro page</h1>
  </div>
</template>

<script>
import PrevRoute from '@/components/PrevRoute/'
export default {
  components: {
    PrevRoute
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

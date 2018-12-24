<template>
  <div class="about">
    <prev-route :prev="'/'" />
    <p>I'll show dabtabase info</p>
  </div>
</template>

<script>
import PrevRoute from '@/components/PrevRoute/'
export default {
  components: {
    PrevRoute
  },
  methods: {
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

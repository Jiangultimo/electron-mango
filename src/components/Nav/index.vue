<template>
  <div>
    <new-connect />
    <connected />
    <history />
  </div>
</template>

<script lang="ts">
import Connected from '@/components/Connected/index.vue'
import History from '@/components/History/index.vue'
import NewConnect from '@/components/NewConnect/index.vue'
import {
  Vue,
  Component
} from 'vue-property-decorator'
@Component({
  components: {
    Connected,
    History,
    NewConnect
  }
})
export default class Nav extends Vue {}
</script>

<style lang="less" scoped>
</style>

<template>
  <div style="display: flex;">
    <div class="home">
      <tabs />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'
import Tabs from '@/components/Tabs/index.vue'

@Component({
  components: {
    Tabs
  }
})
export default class Blank extends Vue {}
</script>

<style lang="less" scoped></style>

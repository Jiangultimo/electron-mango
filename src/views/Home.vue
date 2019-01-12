<template>
  <div style="display: flex;">
    <div class="navs">
      <nav-tree />
    </div>
    <div class="home">
      <h1>Hello, welcome to join electron-mango!</h1>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'
import NavTree from '@/components/Nav/index.vue'

@Component({
  components: {
    NavTree
  }
})
export default class Blank extends Vue {}
</script>

<style lang="less" scoped>
.navs {
  width: 200px;
  min-width: 200px;
  height: 100%;
}
</style>

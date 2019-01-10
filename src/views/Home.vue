<template>
  <div class="home">
    <h1>Hello, welcome to join electron-mango!</h1>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Blank extends Vue {
}
</script>

<style lang="less" scoped>
</style>

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  components: {
  }
}
</script>

<style lang="less">
html, body {
  padding: 0;
  margin: 0;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#nav{
  width: 500px;
}
</style>

<template>
  <div class="home">
    <div id="connected">我会显示已经连接的数据库</div>
    <div id="connectiong">
      <ul>
        <li v-for="(uri,name) in dbList" :key="name">{{name}}</li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
const { remote, ipcRenderer } = window.require('electron')
export default {
  name: 'home',
  data () {
    return {
      dbList: {}
    }
  },
  created () {
    this.dbList = remote.getGlobal('shared').dbList
    ipcRenderer.on('reloadDb', (event, arg) => {
      this.dbList = arg
    })
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

<template>
  <div id="app">
    <div class="navs">
      <new-connect />
      <connected-tree />
      <history />
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ConnectedTree from '@/components/Connected/index.vue'
import NewConnect from '@/components/NewConnect/index.vue'
import History from '@/components/History/index.vue'
const { ipcRenderer } = window.require('electron')
import { mongo } from '@/type/ipc'

@Component({
  components: {
    ConnectedTree,
    NewConnect,
    History
  }
})
export default class App extends Vue {
  created(){
    ipcRenderer.on('connected', (event: any, arg: any) => {
      this.$store.commit('ADD_DB',arg)
    })
    ipcRenderer.on('mongoRes', (event: any, arg: mongo) => {
      this.$store.state.eventList.get(arg.eventId)(arg)
      this.$store.state.eventList.delete(arg.eventId)
    })
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
  display: flex;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.navs{
  width: 200px;
  min-width: 200px;
}
.content{
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
}
</style>

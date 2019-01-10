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
    this.$ipc.on('connected', (event: any, arg: any) => {
      this.$store.commit('ADD_DB',arg)
    })
    this.$ipc.on('mongoRes', (event: any, arg: mongo) => {
      let fun=this.$store.state.eventList.get(arg.eventId)
      if (fun){
        fun(arg)
        this.$store.state.eventList.delete(arg.eventId)
      }
    })
    this.$ipc.on('notify', (event: any, arg: any) => {
      this.$message({
        type: arg.type || 'error',
        message: arg.message
      })
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

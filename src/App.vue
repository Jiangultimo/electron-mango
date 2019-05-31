<template>
  <div id="app">
    <div class="navs">
      <nav-tree />
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import NavTree from '@/components/Nav/index.vue'
import {
  Vue,
  Component
} from 'vue-property-decorator'
import {
  mongo
} from '@/type/ipc'

@Component({
  components: {
    NavTree
  }
})
export default class App extends Vue {
  created() {
    this.$ipc.on('connected', (event: any, arg: any) => {
      this.$store.commit('ADD_DB', arg)
    })
    this.$ipc.on('mongoRes', (event: any, arg: mongo) => {
      let fun = this.$store.state.db.eventList.get(arg.eventId)
      if (fun) {
        fun.handle(arg)
        this.$store.state.db.eventList.delete(arg.eventId)
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
html,
body {
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

.content {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 20px;
}

.navs {
  width: 200px;
  min-width: 200px;
  height: 100%;
}
</style>

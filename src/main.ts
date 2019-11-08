import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'
const { ipcRenderer } = window.require('electron')

declare global {
  interface Window { require: any; }
}
declare module 'vue/types/vue' {
  interface Vue {
    $ipc: {
      on(channel: string, listener: Function): never
      send(channel: string, data: any): never
    }
    _uid: number
    focus(): void
  }
}

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$ipc = ipcRenderer

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

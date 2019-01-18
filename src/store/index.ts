import Vue from 'vue'
import Vuex from 'vuex'
import db from "./DB"
import tab from "./Tabs"

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    db,
    tab
  }
})

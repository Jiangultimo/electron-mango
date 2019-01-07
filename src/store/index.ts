import Vue from 'vue'
import Vuex from 'vuex'

interface State {
  treeData: any[]
}

const state: State = {
  treeData: []
}

Vue.use(Vuex)
export default new Vuex.Store({
  state: state,
  mutations: {
    SET_DBS(state: State, { dbs, linkName, linkAddr }) {
      dbs = dbs.map((db: any, index: number) => {
        return {
          id: `${state.treeData.length}-${index}`,
          label: db.name,
          sizeOnDisck: db.sizeOnDisck
        }
      })
      const link = {
        id: linkName,
        label: linkName,
        link: linkAddr,
        children: dbs
      }
      state.treeData =  state.treeData.concat(link)
      console.log(state.treeData)
    }
  },
  actions: {
    setDBs({ commit }, { payload }) {
      const { dbs, linkName, linkAddr } = payload
      commit('SET_DBS', { dbs, linkName, linkAddr })
    }
  }
})

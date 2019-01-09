import Vue from 'vue'
import Vuex from 'vuex'
import {Link,DbInfo,TreeType,delimiter} from '../type/database'

interface State {
  treeTrance: number
  treeData: Map<string,Link>
  eventId:number
  eventList: Map<number,Function>
}

const state: State = {
  eventList:new Map(),
  eventId:0,
  treeTrance:0,
  treeData:new Map()
}

Vue.use(Vuex)
export default new Vuex.Store({
  state,
  mutations: {
    ADD_EVENT(state: State,fun:Function){
      state.eventId++
      state.eventList.set(state.eventId,fun)
    },
    ADD_DB(state: State, { dbs, name }) {
      dbs = dbs.map((db: any):DbInfo => {
        return {
          id: `${name}${delimiter}${db.name}`,
          name: db.name,
          type: TreeType.Db,
          sizeOnDisk: parseFloat((db.sizeOnDisk / 1024).toFixed(2)),
          child:[]
        }
      })
      const link:Link = {
        id: name,
        name: name,
        type: TreeType.Link,
        child: dbs
      }
      state.treeData.set(name,link)
      state.treeTrance++
    }
  },
  actions: {
  }
})

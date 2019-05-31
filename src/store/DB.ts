import { Link, DbInfo, TreeType, MongoEvent } from '../type/database'
import { delimiter } from "@/utils/utils"
interface State {
  treeTrance: number
  treeData: Map<string, Link>
  eventId: number
  eventList: Map<number, MongoEvent>
}

const state: State = {
  eventList: new Map(),
  eventId: 0,
  treeTrance: 0,
  treeData: new Map()
}
export default {
  state,
  mutations: {
    ADD_EVENT(state: State, obj: MongoEvent) {
      state.eventId++
      state.eventList.set(state.eventId, obj)
    },
    OFF_EVENT(state: State, uid: number) {
      let keys = [...state.eventList.keys()]
      for (const i of keys) {
        if (state.eventList.get(i)!.vueId == uid) {
          state.eventList.delete(i)
        }
      }
    },
    ADD_DB(state: State, { dbs, name }: { dbs: any, name: string }) {
      let child = new Map<string, DbInfo>()
      for (const db of dbs) {
        child.set(db.name, {
          id: `${name}${delimiter}${db.name}`,
          name: db.name,
          type: TreeType.Db,
          sizeOnDisk: parseFloat((db.sizeOnDisk / 1024).toFixed(2)),
        })
      }
      const link: Link = {
        id: name,
        name: name,
        type: TreeType.Link,
        child
      }
      state.treeData.set(name, link)
      state.treeTrance++
    }
  }
}

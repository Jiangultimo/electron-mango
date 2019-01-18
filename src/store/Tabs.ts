import { tab } from "@/type/tabs"
interface State {
	tabs: Array<tab>
	active: string
}
const state: State = {
	tabs: [],
	active: ''
}
export default {
	state,
	mutations: {
		ADD_TAB(state: State, obj: tab) {
			let index = 0
			let name = obj.name
			for (const i of state.tabs) {
				if (i.name == name) {
					index++
					name = obj.name +' '+ index
				}
			}
			obj.name = name
			state.tabs.push(obj)
			state.active=name
		},
		DEL_TAB(state: State, name: string) {
			for (const index in state.tabs) {
				let i = parseInt(index)
				if (state.tabs[i].name == name) {
					if (i == 0) {
						if (state.tabs.length == 1) {
							state.active = ''
						} else {
							state.active = state.tabs[i + 1].name
						}
					} else {
						state.active = state.tabs[i - 1].name
					}
					state.tabs.splice(i, 1)
					return
				}
			}
		}
	}
}
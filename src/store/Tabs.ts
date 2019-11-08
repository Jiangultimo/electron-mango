import { tab } from "@/type/tabs"
interface tab_callback {
	save: CallableFunction
	restore: CallableFunction
}
interface State {
	//用数组而不用map的原因是顺序，tab严格要求顺序一致
	tabs: Array<tab>
	active: string
	callback: tab_callback | null
	//当前组件id
	activeId: number
	//是否需要载入数据
	restore: boolean
}
const state: State = {
	tabs: [],
	active: '',
	activeId: 0,
	restore: false,
	callback: null
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
					name = obj.name + ' ' + index
				}
			}
			obj.name = name
			state.tabs.push(obj)
			state.active = name
		},
		DEL_TAB(state: State, name: string) {
			for (const index in state.tabs) {
				let i = parseInt(index)
				let newName = ''
				if (state.tabs[i].name == name) {
					if (i == 0) {
						if (state.tabs.length == 1) {
							newName = ''
						} else {
							newName = state.tabs[i + 1].name
						}
					} else {
						newName = state.tabs[i - 1].name
					}
					//如果删的是当前的，需要切换tab
					if (name == state.active) {
						state.active = newName
					}
					state.tabs.splice(i, 1)
					return
				}
			}
		},
		CHANGE_TAB(state: State, { from, to, modComponent }: { from: string, to: string, modComponent: boolean }) {
			if (to == '') return //代表关掉了所有标签页，不需要任何处理
			if (state.callback != null && from != '') {
				//保存当前状态
				let data = state.callback.save()
				for (const i of state.tabs) {
					if (i.name == from) {
						i.data = data
						break
					}
				}
			}
			state.active = to
			if (modComponent) {
				state.restore = true
			} else {
				for (const i of state.tabs) {
					if (i.name == to && state.callback != null) {
						state.callback.restore(i.data || {})
						break
					}
				}
			}
		},
		REG_CALLBACK(state: State, { cid, callback }: { cid: number, callback: tab_callback }) {
			state.activeId = cid
			state.callback = callback
			if (state.restore) {
				//切换组件了，需要加载数据
				for (const i of state.tabs) {
					if (i.name == state.active) {
						state.callback.restore(i.data || {})
						state.restore = false
						break
					}
				}
			}
		},
		OFF_EVENT(state: State, cid: number) {
			if (state.activeId == cid) {
				state.callback = null
			}
		},
	}
}
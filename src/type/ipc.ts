import {MessageType} from 'element-ui/types/message'
export interface notify{
	type?:MessageType
	message:string
}
export interface mongo{
	action:string
	eventId:number
	link:string
	db?:string
	collect?:string
	data?:any
}
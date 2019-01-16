export interface DbBelong{
	link:string,
	db?:string,
	collect?:string
}
export function parserMongoStr(str:string):DbBelong{
	let ret:DbBelong={link:''}
	let arr=str.split('.')
	ret.link=arr[0]
	if (arr.length==2){
		ret.db=arr[1]
	}else{
		ret.db=arr[1]
		ret.collect=arr[2]
	}
	return ret
}
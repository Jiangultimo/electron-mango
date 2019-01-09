export interface TreeNode{
  id:string,//连接名.数据库名.表名
  name:string,
  type: TreeType,
  child?:Array<any>
}

export interface Collect extends TreeNode{
  sizeOnDisk:number
}

export interface DbInfo extends TreeNode{
  sizeOnDisk: number
  child: Array<Collect>
}

export interface Link extends TreeNode{
	child: Array<DbInfo>
}

export enum TreeType{
  Link,
  Db,
  Collect
}

export declare type SavedLink = Map<string,string>
export const delimiter='.'
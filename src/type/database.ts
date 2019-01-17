export interface TreeNode {
  id: string,//连接名.数据库名.表名
  name: string,
  type: TreeType,
  child?: Map<string,any>
}

export interface Collect extends TreeNode {
  sizeOnDisk?: number
}

export interface DbInfo extends TreeNode {
  sizeOnDisk: number
  child?: Map<string,Collect>
}

export interface Link extends TreeNode {
  child: Map<string,DbInfo>
}

export interface MongoEvent {
  handle: Function
  vueId: number
}

export enum TreeType {
  Link,
  Db,
  Collect
}

export declare type SavedLink = Map<string, string>
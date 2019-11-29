declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
declare module 'mongodb-query-parser' {
  export function parseFilter(str:string):any
}
declare module 'mongodb-extended-json' {
  export function stringify(obj:Object):string
}
declare module 'vue-json-viewer' {
  
}
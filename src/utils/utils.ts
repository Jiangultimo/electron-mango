export const delimiter = '.'
export interface DbBelong {
  link: string,
  db?: string,
  collect?: string
}
export function parserMongoStr(str: string): DbBelong {
  let ret: DbBelong = { link: '' }
  let arr = str.split(delimiter)
  ret.link = arr[0]
  if (arr.length == 2) {
    ret.db = arr[1]
  } else {
    ret.db = arr[1]
    ret.collect = arr[2]
  }
  return ret
}
export function Mongo2Str(obj: DbBelong): string {
  let r = obj.link + delimiter + obj.db
  if (obj.collect) r += delimiter + obj.collect
  return r
}

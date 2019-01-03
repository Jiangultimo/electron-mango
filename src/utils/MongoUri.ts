export interface mongoUri{
  username:string,
  password:string,
  hosts: {
    host:string,
    port: number
  },
  database: string,
  options: string
}
export default {
  format (params:mongoUri):string {
    var res = 'mongodb://'
    if (params.username !== '') {
      res += encodeURIComponent(params.username) + ':' + encodeURIComponent(params.password) + '@'
    }
    var host = params.hosts.host
    if (host.indexOf(':') >= 0) {
      if (host[0] !== '[') { host = `[${host}]` }
    } else {
      host = encodeURIComponent(host)
    }
    res += `${host}:${params.hosts.port}/`
    if (params.database !== '') {
      res += encodeURIComponent(params.database)
    }
    if (params.options !== '') {
      res += `?${params.options}`
    }
    return res
  },
  parser (uri:string):mongoUri {
    var uriObject:mongoUri = {
      username: '',
      password: '',
      hosts: {
        host: 'localhost',
        port: 27017
      },
      database: '',
      options: ''
    }
    var rest = uri.substring(11)

    var i = rest.indexOf('@')
    if (i >= 0) {
      var credentials = rest.substring(0, i)
      rest = rest.substring(i + 1)
      i = credentials.indexOf(':')
      if (i >= 0) {
        uriObject.username = decodeURIComponent(credentials.substring(0, i))
        uriObject.password = decodeURIComponent(credentials.substring(i + 1))
      } else {
        uriObject.username = decodeURIComponent(credentials)
      }
    }

    i = rest.indexOf('?')
    if (i >= 0) {
      var options = rest.substring(i + 1)
      rest = rest.substring(0, i)
      uriObject.options = options
    }

    i = rest.indexOf('/')
    if (i >= 0) {
      // Make sure the database name isn't the empty string
      if (i < rest.length - 1) {
        uriObject.database = decodeURIComponent(rest.substring(i + 1))
      }
      rest = rest.substring(0, i)
    }
    i = rest.indexOf(']')
    if (i > 0) {
      // It is IPV6
      uriObject.hosts = {
        host: decodeURIComponent(rest.substring(0, i + 1)),
        port: parseInt(rest.substring(i + 2))
      }
    } else {
      i = rest.indexOf(':')
      uriObject.hosts = {
        host: decodeURIComponent(rest.substring(0, i)),
        port: parseInt(rest.substring(i + 1))
      }
    }
    return uriObject
  }
}

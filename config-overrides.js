const path = require('path')
module.exports = function(config, env) {
  Object.assign(config.resolve.alias, {
    '@': path.resolve(__dirname, 'src/')
  })
  console.log(config.resolve.alias)
  return config
}
var fs = require('fs-extra')
var path = require('path')
var configPath = path.resolve(__dirname, '../config.json')

main()

function main () {
  var { config } = getConfig()

  config.user = {}
  updateConfig(config)
}

function prettyJs (obj) {
  return JSON.stringify(obj, null, '  ')
}

function getConfig () {
  var config = fs.readJsonSync(configPath)
  var dft = config.default
  var usr = config.user

  return {
    config, dft, usr
  }
}

function updateConfig (json) {
  fs.writeFileSync(configPath, prettyJs(json))
}
var path = require('path')

const rootPath = path.resolve(__dirname, '..')
const configPath = path.resolve(rootPath, './config.json')
const tplPath = path.resolve(rootPath, './templates')

const forAll = 'all'
const tplConfigFile = './tplkit.config.js'

export {
  rootPath,
  configPath,
  tplPath,
  forAll,
  tplConfigFile
}
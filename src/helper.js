import { configPath } from './store'

var path = require('path')
var fs = require('fs-extra')
var chalk = require('chalk')

function print (msg) {
  console.log(msg)
}

function block (fn) {
  console.log()
  fn()
  console.log()
}

function printSucc (msg, icon = '🎉') {
  print(icon + '  ' + chalk.bold(msg))
}

function printFail (msg, icon = '🚨') {
  print(icon + '  ' + chalk.bold(chalk.red(msg)))
}

function printWarn (msg, icon = '💡') {
  print(icon + '  ' + chalk.yellow(msg))
}

function printInfo (msg, icon = '💬') {
  print(icon + '  ' + chalk.bold(chalk.grey(msg)))
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

function getCfg () {
  var { config, dft, usr } = getConfig()

  return mergeObj(dft, usr)
}

function mergeObj (a, b) {
  return Object.assign({}, a, b)
}

function copyFile (src, dest) {
  fs.outputFileSync(dest, fs.readFileSync(src, 'utf8'))
}

export {
  print,
  block,
  printSucc,
  printFail,
  printWarn,
  printInfo,
  prettyJs,
  getConfig,
  updateConfig,
  getCfg,
  mergeObj,
  copyFile
}
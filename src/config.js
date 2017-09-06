import { print, printSucc, prettyJs, getConfig, updateConfig, getCfg, mergeObj } from './helper'
import { rootPath, configPath, forAll } from './store'

var fs = require('fs-extra')
var chalk = require('chalk')
var path = require('path')

function get () {
  var cfg = getCfg()
  var str = prettyJs(cfg)

  printSucc('Config list:')
  print(chalk.bold(chalk.green(str)))
}

function set (opt, val) {
  var { config, dft, usr } = getConfig();
  var crtPath = process.cwd()
  var realVal = val

  if (opt in dft) {
    switch(opt) {
      case 'tplPath':
      realVal = path.resolve(crtPath, val)
      break;

      default:
      break;
    }

    usr[opt] = realVal
    updateConfig(config)

    printSucc(`Set "${opt}" to "${realVal}" successfully.`)
  }
}

function reset (opt) {
  var { config, dft, usr } = getConfig();

  if (opt === forAll) {
    config.user = {}
    updateConfig(config)

    printSucc(`Reset all options successfully.`)
  }

  if ((opt in usr) && (opt in dft)) {
    delete usr[opt]
    updateConfig(config)

    printSucc(`Reset "${opt}" successfully.`)
  }
}

export {
  get, set, reset
}
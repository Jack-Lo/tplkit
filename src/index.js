import { get, set, reset } from './config'
import {
  getConfig, updateConfig, getCfg,
  printSucc, printFail, printWarn, printInfo,
  copyFile
} from './helper'
import { tplPath, tplConfigFile } from './store'

var inquirer = require('inquirer')
var fs = require('fs-extra')
var exists = fs.existsSync
var path = require('path')
var glob = require('glob')

class Tplkit {
  constructor (program) {
    var config = require('../config.json')

    if (!config.default.tplPath) {
      config.default.tplPath = tplPath
      updateConfig(config)
    }

    this.program = program
  }

  init () {
    var _t = this

    getBaseInfo()
    .then((res) => {
      var cfg = getCfg()
      var { projectName, templateType } = res
      var crtPath = process.cwd()
      var projectPath = path.resolve(crtPath, projectName)
      var crtTplPath = path.resolve(cfg.tplPath, templateType)
      var tplConfigPath = path.resolve(crtTplPath, tplConfigFile)

      if (exists(projectPath)) {
        if (_t.program.force) {
          fs.removeSync(projectPath)
        } else {
          printFail(`Directory "${projectName}" exists.`)

          return
        }
      }

      if (!exists(tplConfigPath)) {
        printWarn(`A config file in "${crtTplPath}" is missing.`, '🙈')
        copyTpl.call(_t, crtTplPath, projectPath)
        allDone()
      } else {
        var { questions, replace, include, exclude } = require(tplConfigPath)

        getTplInfo(questions)
        .then((tplRes) =>  {
          var allRes = Object.assign({}, res, tplRes)

          copyTpl.call(_t, crtTplPath, projectPath, include, exclude)

          if (replace && replace.length > 0) {
            replace.map((r) => {
              var { file, parser } = r
              var f = path.resolve(projectPath, r.file)

              if (!exists(f)) {
                return
              }

              replaceTpl.call(_t, {
                file: f,
                parser: (cnt) => parser(cnt, allRes)
              })
            })

            printSucc('Replace template successfully.')
            allDone()
          } else {
            allDone()
          }
        })
      }
    })
  }

  get () {
    get.call(this)
  }

  set (opt, val) {
    set.call(this, opt, val)
  }

  reset (opt) {
    reset.call(this, opt)
  }
}

function getBaseInfo () {
  var cfg = getCfg()
  var types = []

  if (exists(cfg.tplPath)) {
    types = fs.readdirSync(cfg.tplPath)
  } else {
    printFail(`Directory "${cfg.tplPath}" does no exists.`)

    return new Promise((res, rej) => {})
  }

  if (!types || types.length < 1) {
    printWarn('Templates no found.')

    return new Promise((res, rej) => {})
  }

  return inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'test_tplkit'
    },
    {
      type: 'list',
      name: 'templateType',
      message: 'Template type:',
      choices: types,
      default: 0
    }
  ])
}

function getTplInfo (questions) {
  var qs = (typeof questions === 'function') ? questions() : questions

  if (!(qs && qs.length > 1)) {
    printWarn(`Empty "questions" setting.`, '🙈')
  }

  return inquirer.prompt(qs)
}

function copyTpl (from, dist, include = ['**/**'], exclude = []) {
  var _t = this
  var files = []

  include.map((g) => {
    var res = glob.sync(g, {
      cwd: from,
      dot: true,
      absolute: true,
      nodir: true,
      ignore: exclude
    })

    files = files.concat(res)
  })

  if (files && files.length > 0) {
    files.map((f) => {
      var dest = f.replace(from, dist)

      if (_t.program.detail) {
        printInfo(`Start copying:`, '🐝')
        console.log(`"${f}"`)
        copyFile(f, dest)
        printInfo(`Finish copying.`, '✨')
      } else {
        copyFile(f, dest)
      }
    })

    printSucc('Copy template successfully.')
  }
}

function replaceTpl ({file, parser}) {
  var _t = this
  var data = fs.readFileSync(file, 'utf8')
  var res = parser(data)

  if (_t.program.detail) {
    printInfo(`Start replacing:`, '🐝')
    console.log(`"${file}"`)
    fs.outputFileSync(file, res)
    printInfo(`Finish replacing`, '✨')
  } else {
    fs.outputFileSync(file, res)
  }
}

function allDone () {
  printSucc('All done, have a nice working day!')
}

export default Tplkit
#!/usr/bin/env node

var program = require('commander')
var version = require('../package.json').version
var chalk = require('chalk')
var Tplkit = require('../lib/index.js')
var tplkit = new Tplkit(program)

program.version(version)

program
  .option('-B, --debug', 'debug modole.')
  .option('-F, --force', 'create a project by force.')
  .option('-D, --detail', 'show detail informations.')

program
  .command('init')
  .description('init and create a project.')
  .action(() => {
    tplkit.init()
  })

program
  .command('config')
  .description('get a configuration list.')
  .action(() => {
    tplkit.get()
  })

program
  .command('set <option> <value>')
  .description('configure dev-kit.')
  .action((option, value) => {
    tplkit.set(option, value)
  })

program
  .command('reset <option>')
  .description('reset an option to a default value.')
  .action((option) => {
    tplkit.reset(option)
  })

program.parse(process.argv)

if (program.args.length < 1) {
  program.help()
}
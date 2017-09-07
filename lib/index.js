'use strict';

var path$3 = require('path');

var rootPath = path$3.resolve(__dirname, '..');
var configPath = path$3.resolve(rootPath, './config.json');
var tplPath = path$3.resolve(rootPath, './templates');

var forAll = 'all';
var tplConfigFile = './tplkit.config.js';

var path$2 = require('path');
var fs$2 = require('fs-extra');
var chalk$1 = require('chalk');

function print(msg) {
  console.log(msg);
}

function printSucc(msg) {
  var icon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '🎉';

  print(icon + '  ' + chalk$1.bold(msg));
}

function printFail(msg) {
  var icon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '🚨';

  print(icon + '  ' + chalk$1.bold(chalk$1.red(msg)));
}

function printWarn(msg) {
  var icon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '💡';

  print(icon + '  ' + chalk$1.yellow(msg));
}

function printInfo(msg) {
  var icon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '💬';

  print(icon + '  ' + chalk$1.bold(chalk$1.grey(msg)));
}

function prettyJs(obj) {
  return JSON.stringify(obj, null, '  ');
}

function getConfig() {
  var config = fs$2.readJsonSync(configPath);
  var dft = config.default;
  var usr = config.user;

  return {
    config: config, dft: dft, usr: usr
  };
}

function updateConfig(json) {
  fs$2.writeFileSync(configPath, prettyJs(json));
}

function getCfg() {
  var _getConfig = getConfig(),
      config = _getConfig.config,
      dft = _getConfig.dft,
      usr = _getConfig.usr;

  return mergeObj(dft, usr);
}

function mergeObj(a, b) {
  return Object.assign({}, a, b);
}

function copyFile(src, dest) {
  fs$2.outputFileSync(dest, fs$2.readFileSync(src, 'utf8'));
}

var fs$1 = require('fs-extra');
var chalk = require('chalk');
var path$1 = require('path');

function get() {
  var cfg = getCfg();
  var str = prettyJs(cfg);

  printSucc('Config list:');
  print(chalk.bold(chalk.green(str)));
}

function set(opt, val) {
  var _getConfig = getConfig(),
      config = _getConfig.config,
      dft = _getConfig.dft,
      usr = _getConfig.usr;

  var crtPath = process.cwd();
  var realVal = val;

  if (opt in dft) {
    switch (opt) {
      case 'tplPath':
        realVal = path$1.resolve(crtPath, val);
        break;

      default:
        break;
    }

    usr[opt] = realVal;
    updateConfig(config);

    printSucc('Set "' + opt + '" to "' + realVal + '" successfully.');
  }
}

function reset(opt) {
  var _getConfig2 = getConfig(),
      config = _getConfig2.config,
      dft = _getConfig2.dft,
      usr = _getConfig2.usr;

  if (opt === forAll) {
    config.user = {};
    updateConfig(config);

    printSucc('Reset all options successfully.');
  }

  if (opt in usr && opt in dft) {
    delete usr[opt];
    updateConfig(config);

    printSucc('Reset "' + opt + '" successfully.');
  }
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inquirer = require('inquirer');
var fs = require('fs-extra');
var exists = fs.existsSync;
var path = require('path');
var glob = require('glob');

var Tplkit = function () {
  function Tplkit(program) {
    classCallCheck(this, Tplkit);

    this.program = program;
  }

  createClass(Tplkit, [{
    key: 'init',
    value: function init() {
      var _t = this;

      getBaseInfo().then(function (res) {
        var cfg = getCfg();
        var tplPathF = cfg.tplPath ? cfg.tplPath : tplPath;
        var projectName = res.projectName,
            templateType = res.templateType;

        var crtPath = process.cwd();
        var projectPath = path.resolve(crtPath, projectName);
        var crtTplPath = path.resolve(tplPathF, templateType);
        var tplConfigPath = path.resolve(crtTplPath, tplConfigFile);

        if (exists(projectPath)) {
          if (_t.program.force) {
            fs.removeSync(projectPath);
          } else {
            printFail('Directory "' + projectName + '" exists.');

            return;
          }
        }

        if (!exists(tplConfigPath)) {
          printWarn('A config file in "' + crtTplPath + '" is missing.', '🙈');
          copyTpl.call(_t, crtTplPath, projectPath);
          allDone();
        } else {
          var _require = require(tplConfigPath),
              questions = _require.questions,
              replace = _require.replace,
              include = _require.include,
              exclude = _require.exclude;

          getTplInfo(questions).then(function (tplRes) {
            var allRes = Object.assign({}, res, tplRes);

            copyTpl.call(_t, crtTplPath, projectPath, include, exclude);

            if (replace && replace.length > 0) {
              replace.map(function (r) {
                var file = r.file,
                    _parser = r.parser;

                var f = path.resolve(projectPath, r.file);

                if (!exists(f)) {
                  return;
                }

                replaceTpl.call(_t, {
                  file: f,
                  parser: function parser(cnt) {
                    return _parser(cnt, allRes);
                  }
                });
              });

              printSucc('Replace template successfully.');
              allDone();
            } else {
              allDone();
            }
          });
        }
      });
    }
  }, {
    key: 'get',
    value: function get$$1() {
      get.call(this);
    }
  }, {
    key: 'set',
    value: function set$$1(opt, val) {
      set.call(this, opt, val);
    }
  }, {
    key: 'reset',
    value: function reset$$1(opt) {
      reset.call(this, opt);
    }
  }]);
  return Tplkit;
}();

function getBaseInfo() {
  var cfg = getCfg();
  var types = [];
  var tplPathF = cfg.tplPath ? cfg.tplPath : tplPath;

  if (exists(tplPathF)) {
    types = fs.readdirSync(tplPathF);
  } else {
    printFail('Directory "' + cfg.tplPath + '" does no exists.');

    return new Promise(function (res, rej) {});
  }

  if (!types || types.length < 1) {
    printWarn('Templates no found.');

    return new Promise(function (res, rej) {});
  }

  return inquirer.prompt([{
    type: 'input',
    name: 'projectName',
    message: 'Project name:',
    default: 'test_tplkit'
  }, {
    type: 'list',
    name: 'templateType',
    message: 'Template type:',
    choices: types,
    default: 0
  }]);
}

function getTplInfo(questions) {
  var qs = typeof questions === 'function' ? questions() : questions;

  if (!(qs && qs.length > 1)) {
    printWarn('Empty "questions" setting.', '🙈');
  }

  return inquirer.prompt(qs);
}

function copyTpl(from, dist) {
  var include = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['**/**'];
  var exclude = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var _t = this;
  var files = [];

  include.map(function (g) {
    var res = glob.sync(g, {
      cwd: from,
      dot: true,
      absolute: true,
      nodir: true,
      ignore: exclude
    });

    files = files.concat(res);
  });

  if (files && files.length > 0) {
    files.map(function (f) {
      var dest = f.replace(from, dist);

      if (_t.program.detail) {
        printInfo('Start copying:', '🐝');
        console.log('"' + f + '"');
        copyFile(f, dest);
        printInfo('Finish copying.', '✨');
      } else {
        copyFile(f, dest);
      }
    });

    printSucc('Copy template successfully.');
  }
}

function replaceTpl(_ref) {
  var file = _ref.file,
      parser = _ref.parser;

  var _t = this;
  var data = fs.readFileSync(file, 'utf8');
  var res = parser(data);

  if (_t.program.detail) {
    printInfo('Start replacing:', '🐝');
    console.log('"' + file + '"');
    fs.outputFileSync(file, res);
    printInfo('Finish replacing', '✨');
  } else {
    fs.outputFileSync(file, res);
  }
}

function allDone() {
  printSucc('All done, have a nice working day!');
}

module.exports = Tplkit;

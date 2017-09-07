**tplkit**是一个模板管理工具，能够帮助你快速地制作可配置的模板，并在初始化时进行便捷的差异化订制。

## Install

全局安装：  

```shell
npm install tplkit -g
```

使用`tplkit -V`命令检查安装是否成功：  

```shell
tplkit -V
```


## Cli

命令 | 含义
---- | ----
init | 初始化一个项目
config | 获取`tplkit`的当前配置
set <option\> <value\> | 配置`tplkit`
reset <option\> | 重置配置项

### init

输入`tplkit init`回车之后，会有一段基础配置的会话，包括：

- **Project name**：项目名，即最终生成的项目的文件夹名
- **Template type**：模板类型，即模板目录下存放的模板，选择其中一种即可根据该模板来生成项目

完成以上会话以后，进入模板的配置工作，在还没有进行配置之前，`tplkit`只有一种模板类型，也就是`demo`，我们选择demo之后，将会进入到模板的配置会话里，如下：

```shell
$ tplkit init
? Project name: test_tplkit
? Template type: demo
? Name: demo
? Description: a demo template.
? Author: Jack Lo
? Version: 1.0.0
🎉  Copy template successfully.
🎉  Replace template successfully.
🎉  All done, have a nice working day!
```

以上过程，从`? Name:`开始便是`demo`的相关配置内容，这个是由`demo`目录下的`tplkit.config.js`文件来设置的，也就是说，你可以通过模板配置文件来获取你需要的用户输入数据。

完成以上工作后，在当前目录下，会生成一个与`Project name`的输入值对应的项目，这里是`test_tplkit`，打开看到`package.json`，我们可以看到前面输入的`Name`、`Description`、`Author`、`Version`都会对应出现在相关字段里：

```javascript
{
  "name": "demo",
  "version": "1.0.0",
  "description": "a demo template.",
  "main": "index.js",
  "author": "Jack Lo",
  "license": "MIT"
}
```

不仅仅是`package.json`，项目下的任何文件都可以被修改，只要你在`tplkit.config.js`中配置了相关内容，这一块我们后面会介绍，感兴趣的可以先看看`test_tplkit/tplkit.config.js`。

这就是`init`的过程，根据简单的用户输入快速生成一个项目。


### config

获取配置信息：

```shell
$ tplkit config
🎉  Config list:
{
  "tplPath": null
}
```

配置信息是由**默认配置信息**和**用户配置信息**两部分**merge**而来的，所以对于同一配置项，用户配置会覆盖默认配置，否则默认是默认配置信息：

- **tplPath**：即模板的存放目录，默认使用`tplkit`所在目录下的`templates`目录


### set

设置用户配置信息：

```shell
$ tplkit set tplPath ./templates
🎉  Set "tplPath" to "/Users/jack/Desktop/develop/templates" successfully.
```

set后面跟两个参数：`option`与`value`，如上，我们设置了`tplPath`为当前目录（`process.cwd()`）下的`./templates`，则之后的模板寻找都会在这个目录下进行，现在我们新建一个目录`templates`，在`templates`下继续新建两个目录`a`、`b`：

```shell
- templates
  - a
    - a.js
  - b
    - b.js
```

现在在试试执行`tplkit init`：

```shell
? Project name: test_tplkit
? Template type: a
🙈  A config file in "/Users/jack/Desktop/develop/templates/a" is missing.
🎉  Copy template successfully.
🎉  All done, have a nice working day!
```

你会发现`Template type`项有了`a`和`b`两种模板类型了，同时生成的`test_tplkit`的结构与我们新建的模板`a`的结构保持一致，因为`test_tplkit`就是copy了`a`。

> 注意：这里会提示我们没有找到`tplkit.config.js`文件，因为我们还没有做相关的配置，而即便没有配置，也不影响其运行，默认copy整个模板。


### reset

有了`set`来设置用户配置，我们可能还需要一个重置功能，将用户配置清除，恢复到默认配置：

```shell
$ tplkit reset tplPath
🎉  Reset "tplPath" successfully.
```

或者直接清除全部用户配置：

```shell
$ tplkit reset all
🎉  Reset all options successfully.
```


## 模板制作

在讲到`set`的时候，我们已经有涉及到一部分内容，基本流程就是：

1. 设置`tplPath`**模板路径**
2. 在模板目录下**新建模板**，假设是`a`
3. 在`a`的根目录下新建**模板配置文件**`tplkit.config.js`，并编辑相关配置内容
4. 开始`a`的**模板开发**工作

这里我们着重讲解一下`tplkit.config.js`的内容，其他步骤都比较简单，没什么可讲的。

而事实上`tplkit.config.js`的内容也很简单，我们看一下`demo`的：

```javascript
module.exports = {
  questions (anws) {
    return [
      {
        type: 'input',
        name: 'name',
        message: 'Name:',
        default: 'demo'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
        default: 'a demo template.'
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author:',
        default: 'Jack Lo'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version:',
        default: '1.0.0'
      }
    ]
  },
  replace: [
    {
      file: './package.json',
      parser (cnt, args) {
        return cnt
        .replace('"name": "demo"', `"name": "${args.name}"`)
        .replace('"description": "a demo template."', `"description": "${args.description}"`)
        .replace('"author": "Jack Lo"', `"author": "${args.author}"`)
        .replace('"version": "1.0.0"', `"version": "${args.version}"`)
      }
    }
  ],
  include: ['**/**'],
  exclude: ['node_modules/**']
}
```

分为四部分来看：


### questions

会话数组，表示希望通过用户的输入得到的信息，具体参数设置请参考：[inquirer](https://github.com/sboudrias/Inquirer.js)。


### replace

替换数组，也就是需要替换的内容，比如我们之前演示`demo`的时候，根据用户输入的内容，来替换`package.json`里的相应内容。

replace的一个item分为两个部分：

- **file**：需要替换的文件
- **parser**：替换的函数，接受两个参数`cnt`和`args`，`cnt`是根据`file`来读取的文本内容，你可以对其进行处理，最后return一个新的文本内容，完成替换；而`args`则是由会话得到的结果对象，这包括**基础会话**得到的结果和由设置的`questions`得到的结果的集合


### include && exclude

需要被copy到项目里的文件**模式**，这里我们用到了[glob](https://github.com/isaacs/node-glob)，**include**对应glob的**pattern**，而**exclude**则对应glob的**options.ignore**，具体可以查看它的文档。

有一点不同的是，**include**是一个数组，而glob的**pattern**规定是一个字符串，这是由于我们对其进行了功能扩展，使**include**支持数组的方式，这是为了满足**include**多个目录或者文件的情况。


## 其他

使用`tplkit init`还可以补充一些参数，`--force`表示如果存在同名的项目名称，则直接覆盖，如果不加这个参数，遇到存在同名项目的情况下，初始化会取消，直到你删除了这个同名目录：

```shell
$ tplkit init
? Project name: test_tplkit
? Template type: demo
🚨  Directory "test_tplkit" exists.
```

`--detail`表示打印详细信息：

```shell
$ tplkit init --detail
? Project name: test_tplkit
? Template type: demo
? Name: demo
? Description: a demo template.
? Author: Jack Lo
? Version: 1.0.0
🐝  Start copying:
"/Users/jack/Desktop/develop/templates/demo/.gitignore"
✨  Finish copying.
🐝  Start copying:
"/Users/jack/Desktop/develop/templates/demo/tplkit.config.js"
✨  Finish copying.
🐝  Start copying:
"/Users/jack/Desktop/develop/templates/demo/package.json"
✨  Finish copying.
🐝  Start copying:
"/Users/jack/Desktop/develop/templates/demo/src/index.js"
✨  Finish copying.
🎉  Copy template successfully.
🐝  Start replacing:
"/Users/jack/Desktop/develop/test_tplkit/package.json"
✨  Finish replacing
🎉  Replace template successfully.
🎉  All done, have a nice working day!
```



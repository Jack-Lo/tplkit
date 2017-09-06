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
    },
    {
      file: './src/index.js',
      parser (cnt, args) {
        return cnt
        .replace('world', args.author)
      }
    }
  ],
  exclude: ['node_modules/**']
}
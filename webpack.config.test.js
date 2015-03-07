var path = require('path')

module.exports = {
  entry: './test/main.spec.coffee',

  output: {
    path: path.join(__dirname, 'test'),
    filename: 'test.js'
  },

  debug: true,
  devtool: 'eval-source-map',

  module: {
    loaders: [

      { test: /main.spec.coffee$/,
        loaders: ['mocha'] },

      { test: /\.coffee$/,
        loader: 'coffee' },

      { test: /\.html$/,
        loader: 'html' },

      { test: /sinon.*\.js$/,
        loader: 'imports?define=>false' }

    ]
  },

  resolve: {
    extensions: ['', '.js', '.coffee', '.html']
  },

  node: {
    fs: 'empty'
  }
}
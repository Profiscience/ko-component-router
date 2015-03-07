var path = require('path')

module.exports = {
  entry: './src/main.coffee',
  
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'ko-component-router.js',
    library:  'ko-component-router',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      
      { test: /\.coffee$/,
        loader: 'coffee' },

      { test: /\.html$/,
        loader: 'html' }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.coffee', '.html']
  },

  externals: {
    'knockout': 'knockout'
  },

  node: {
    fs: 'empty'
  }
}
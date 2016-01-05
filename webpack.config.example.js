'use strict'

module.exports = {
  entry: './example/app.js',

  output: {
    path: 'example/dist',
    filename: 'bundle.js',
    publicPath: '/ko-component-router/example/dist/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      },

      {
        test: /\.css$/,
        loader: 'style!css'
      },

      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&minetype=application/font-woff'
      },

      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file'
      }
    ]
  },

  devtool: 'source-map'
}

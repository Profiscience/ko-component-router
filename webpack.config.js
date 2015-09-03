module.exports = {
  entry: './src/index.js',

  output: {
    path: 'dist',
    filename: 'ko-component-router.js',
    library:  'ko-component-router',
    libraryTarget: 'umd'
  },

  externals: {
    'knockout': {
      root: 'ko',
      commonjs: 'knockout',
      amd: 'knockout'
    }
  }
}

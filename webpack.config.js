const path = require('path');

module.exports = {
  entry: './src/assets/scripts/main.js',
  output: {
    path: path.resolve(__dirname, 'dist/assets/scripts'),
    filename: 'main.js'
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000,
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}

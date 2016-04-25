var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',  // 輸出的檔案名稱
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // => 啟用 HMR
    new webpack.NoErrorsPlugin() // => 不要把錯誤的 Code 打包進來
  ],
  module: {
    loaders: [{
        test: /\.css$/,
        loader: "style!css",
        exclude: /node_modules/
    }, {
      test: /\.js$/,   // 針對 js 檔
      loaders: ['babel'],
      exclude: /node_modules/   // 不要處理 3rd party 的 code
    }]
  }
};
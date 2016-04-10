// module.exports = {
//     entry: "./entry.js",
//     output: {
//         path: __dirname,
//         filename: "bundle.js"
//     },
//     module: {
//         loaders: [{
// 					test: /\.css$/, loader: "style!css",
// 					loaders: ['babel'],
// 					exclude: /node_modules/
// 				}]
//     }
// };

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: './src/entry',  // 進入點
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',  // 輸出的檔案名稱
  },
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
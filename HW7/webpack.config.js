var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: './src/index',  // 進入點
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',  // 輸出的檔案名稱
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
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
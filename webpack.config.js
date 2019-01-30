const path = require('path');
const webpack = require('webpack');

module.exports = {
  //context: path.resolve(__dirname, '/'),
  entry: [
    'jquery',
    './core/js/frame.js',
    './index.js'
  ],
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // optimization: {
  //      splitChunks: {
  //      chunks: 'all'
  //    }
  // },
  module: {
   rules: [
      // {
      //   test: require.resolve('./index.js'),
      //   use: 'imports-loader'
      // },
      // {
      //   test: /\.exec\.js$/,
      //   use: [ 'script-loader' ]
      // },
      {
        test: /\.css$/,
        use: [
         'style-loader',
         'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use:[
         'file-loader'
        ]
     }
   ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $j: 'jquery',
      jQuery: 'jquery'
    })
  ]
};


const path = require('path');
const webpack = require('webpack');

module.exports = {
  watch:true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: "/node_modules/"
  },
  entry: {
    jquery:'jquery',
    core: './core/js/index.js',
    index: './index.js',
    studio:'./studio/js/modify/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       default: false,
  //       vendors: false,
  //       // vendor chunk
  //       vendor: {
  //         // sync + async chunks
  //         chunks: 'all',
  //         // import file path containing node_modules
  //         test: /node_modules/
  //       }
  //     }
  //   }
  // },
  module: {
   rules: [
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
     // {
     //   test: /\.js$/,
     //   exclude: /node_modules/,
     //   use: {
     //     loader: 'babel-loader',
     //     options: {
     //       presets: ['env']
     //     }
     //   }
     // }
   ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      "$j": 'jquery',
      "jQuery": 'jquery',
      // "window.jQuery":'jquery',
      // "window.$j": 'jquery',
      "_": 'lodash',
      "window._":'lodash',
      "window.vis":"vis"
    })
  ],
  devServer: {
    //contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 9000,
    hot: false
  }
};


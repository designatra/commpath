const path = require('path');
const webpack = require('webpack');

module.exports = {
  //context: path.resolve(__dirname, '/'),
  watch:true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: "/node_modules/"
  },
  externals: {
    // jquery: {
    //   root:"jQuery"
    // },
    // lodash : {
    //   commonjs: 'lodash',
    //   amd: 'lodash',
    //   root: '_' // indicates global variable
    // }
  },
  entry: [
    'jquery',
    './core/js/frame.js',
    'vis',
    './index.js'
  ],
  // resolve: {
  //   alias: {
  //     Studio: path.resolve(__dirname, '../../studio/js/'),
  //     Core: path.resolve(__dirname, '../../core/js/')
  //   }
  // },
  output: {
    filename: 'bundle.js',
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
      // {
      //   test: require.resolve('./index.js'),
      //   use: 'imports-loader'
      // },
      // {
      //   test: /\.exec\.js$/,
      //   use: [ 'script-loader' ]
      // },
     // {
     //   test: /node_modules[\\\/]vis[\\\/].*\.js$/,
     //    loader: 'babel-loader',
     //    query: {
     //      cacheDirectory: true,
     //        presets: [ "babel-preset-es2015" ].map(require.resolve),
     //        plugins: [
     //        "transform-es3-property-literals", // #2452
     //        "transform-es3-member-expression-literals", // #2566
     //        "transform-runtime" // #2566
     //      ]
     //    }
     //  },
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
     //   loader: "babel-loader",
     //   options: {
     //     rootMode: "upward",
     //   }
     // },
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
  // stats: {
  //   colors: true
  // },
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
    // new PreloadWebpackPlugin({
    //   include: 'all', // Needed to get index-bundle.js prefetched.
    //   rel: 'prefetch'
    // }),
    //new webpack.optimize.UglifyJsPlugin()
  ],
  //devtool: 'source-map',
  devServer: {
    //contentBase: path.join(__dirname, 'dist'),
    compress: false,
    port: 9000,
    hot: false
  }
};


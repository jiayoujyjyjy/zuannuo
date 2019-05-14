'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

// 引入webpack 保证new webpack...不报错
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    // 'babel-polyfill': 'babel-polyfill',
    app: ["babel-polyfill",'./src/main.js']
  },
  externals: {
    "BMap": "BMap",
    'BMAP_STATUS_SUCCESS': 'BMAP_STATUS_SUCCESS',
    'BMAP_ANCHOR_TOP_LEFT': 'BMAP_ANCHOR_TOP_LEFT',
    'BMAP_ANCHOR_TOP_RIGHT': 'BMAP_ANCHOR_TOP_RIGHT',
    'BMAP_ANCHOR_BOTTOM_RIGHT': 'BMAP_ANCHOR_BOTTOM_RIGHT',
    'BMAP_ANCHOR_BOTTOM_LEFT': 'BMAP_ANCHOR_BOTTOM_LEFT',
    'BMAP_NAVIGATION_CONTROL_SMALL': 'BMAP_NAVIGATION_CONTROL_SMALL',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'api': path.resolve(__dirname, '../src/api'),
      'vendor': path.resolve(__dirname, '../src/vendor'),
    }
  },
  // 这个好像不需要也可以的，因为jquery是Npm安装的，直接在当前组件import $ from 'jquery'即可
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    })
  ],
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

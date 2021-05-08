/* eslint-disable prettier/prettier */
const path = require('path');
const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/production-sub-path/'
    : '/',
  runtimeCompiler: true,
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  outputDir: 'dist',
  devServer: {
    host: '0.0.0.0', // 允许外部ip访问
    port: 8080, // 端口
    https: false, // 启用https
    overlay: { // 错误、警告在页面弹出
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost/api',
        changeOrigin: true, // 允许websockets跨域
        // ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    } // 代理转发配置，用于调试环境
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'

      // 将每个依赖包打包成单独的js文件
      let optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000, // 依赖包超过20000bit将被单独打包
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name (module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `build.${packageName.replace('@', '')}`
              }
            }
          }
        },
        minimizer: [
          new UglifyPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true, // console
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })],
      }

      Object.assign(config, {
        optimization,
      })

    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        alias: {// 别名配置
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          '@v': path.resolve(__dirname, './src/views'),
          '@u': path.resolve(__dirname, './src/utils')
        }
      }
    })
  },
  chainWebpack: config => {},
  // css相关配置
  css: {
    // extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: true, // 开启 CSS source maps?
    // loaderOptions: {
    //   css: {}, // 这里的选项会传递给 css-loader
    //   //postcss: {} // 这里的选项会传递给 postcss-loader
    // }, // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
    // requireModuleExtension: true // 启用 CSS modules for all css / pre-processor files.
  },
}
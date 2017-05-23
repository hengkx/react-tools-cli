import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import pxtorem from 'postcss-pxtorem';
import baseConfig from './webpack.config.base';
import theme from './themes/theme';

function getIPAdress() {
  const interfaces = require('os').networkInterfaces();// eslint-disable-line global-require
  for (const devName in interfaces) { // eslint-disable-line guard-for-in, no-restricted-syntax
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i += 1) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

const host = getIPAdress();
const port = 5000;

export default webpackMerge(baseConfig, {
  devtool: 'cheap-module-source-map',
  devServer: {
    host,
    port,
    hot: true,
    historyApiFallback: true,
    compress: true,
  },
  entry: [
    'react-hot-loader/patch',
    'babel-polyfill',
    `webpack-dev-server/client?http://${host}:${port}`,
    'webpack/hot/only-dev-server',
    './src/index.js',
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)?$/i,
        loader: 'url-loader?name=resources/images/[name]-[hash:10].[ext]&limit=1000!image-webpack-loader'
      },
      {
        test: /\.css$/i,
        include: /node_modules/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.less$/i,
        loader: `style-loader!css-loader!postcss-loader!less-loader?{sourceMap:true,modifyVars:${JSON.stringify(theme)}}`
      },
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => ([
          pxtorem({
            rootValue: 100,
            propWhiteList: [],
          })
        ])
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      __DEBUG__: false,
    }),
  ],
});

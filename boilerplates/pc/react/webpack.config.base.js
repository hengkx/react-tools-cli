import path from 'path';
import webpack from 'webpack';
import HtmlPlugin from 'html-webpack-plugin';

export default {
  output: {
    path: path.join(__dirname, 'app'),
    publicPath: '/',
    filename: 'resources/js/[name]-[hash:10].js',
    chunkFilename: 'resources/js/[name]-[chunkhash:10].js',
  },
  resolve: {
    alias: {
      rework: 'rework.less/rework.less'
    },
    extensions: [
      '.web.js',
      '.jsx',
      '.js',
      '.less',
      '.css',
      '.json',
    ],
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/i,
        use: [
          'svg-sprite-loader?name=[name]-[hash:10]',
          `image-webpack-loader?${JSON.stringify({
            svgo: {
              plugins: [
                { cleanupAttrs: true },
                { cleanupEnableBackground: true },
                { cleanupIDs: true },
                { removeRasterImages: true },
                { removeDimensions: true },
                { removeStyleElement: true },
              ]
            }
          })}`
        ]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      inject: true,
      template: './src/index.ejs',
      title: 'React Boilerplate',
      favicon: './src/favicon.ico',
      minify: {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        removeComments: true,
        removeEmptyAttributes: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
};

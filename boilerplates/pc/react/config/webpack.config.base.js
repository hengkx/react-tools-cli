import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import HtmlPlugin from 'html-webpack-plugin';

let config = {
  projectPath: __dirname,
  sourceDir: 'src',
  distDir: 'app',
  port: 5000
};

if (process.env.id) {
  config = JSON.parse(fs.readFileSync(`./${process.env.id}.json`, 'utf-8'));
} else if (fs.existsSync('./webpack.json')) {
  config = JSON.parse(fs.readFileSync('./webpack.json', 'utf-8'));
} else if (fs.existsSync('./.reactconfig')) {
  config = JSON.parse(fs.readFileSync('./.reactconfig', 'utf-8')).webpack;
}
if (config.projectPath === '__dirname') {
  config.projectPath = __dirname;
}

export { config };

export default {
  output: {
    path: path.join(config.projectPath, config.distDir),
    publicPath: '/',
    filename: 'resources/js/[name]-[hash:10].js',
    chunkFilename: 'resources/js/[name]-[chunkhash:10].js',
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules'), "node_modules"],
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
      template: path.join(config.projectPath, config.sourceDir, 'index.ejs'),
      title: 'React Boilerplate',
      favicon: path.join(config.projectPath, config.sourceDir, 'favicon.ico'),
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
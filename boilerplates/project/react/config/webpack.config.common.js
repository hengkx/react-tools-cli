import fs from 'fs';
import { resolve, join } from 'path';
import webpack from 'webpack';
import HtmlPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';
import SvgSpritePlugin from 'svg-sprite-loader/plugin'
import SpritesmithPlugin from 'webpack-spritesmith'

import configs, { platform, general, theme, directory, compiler, } from './.vd/project.json';


// 划分维度 {
    // 两种环境（environment）：开发环境（development）、生产环境（production）
    // 两种模式：调试模式，非调试模式
    const DEBUG = process.env.NODE_ENV !== 'production';

    // 两种场景（scene）：客户端（client），服务端（server）
    // 代码层面划分
    // const $scene = scene === 'client';

    // 两种平台（platform）：桌面（pc）、移动（mobile）
    // import { platform } from './.vd/project.json';
    const $PC = platform === 'pc';

    // 两种应用类型（type）：网页（web），原生（native）
    // import { type } from './.vd/project.json';
    const $Web = platform === 'web';

    // 实现（realize）
    // Node.js 8，Webpack 2，Babel 6，BrowserSync、Less、PostCSS、axios、MockJS
    // React 15.6.x
    // React Router 4
    // Redux 3
    // Redux Saga 0.15.x
    // ======================================
    // PC Web：React，Ant Design（antd）
    // PC Native：React，Electron，Ant Design（antd）
    // Mobile Web：React，Mobile Ant Design（antd-mobile）
    // Mobile Native：React Native，Mobile Ant Design（antd-mobile）
// }；


if (DEBUG && configs.general.publicPath === '.') {
    configs.general.publicPath = '';
}

if (configs.dir === '__dirname') {
    configs.dir = __dirname;
}

const assets = JSON.parse( fs.readFileSync( join(configs.dir, directory.build.envName, 'webpack-assets.json') , 'utf8') );



// svg 目录
const svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''),
    join(configs.dir, directory.development.envName, directory.development.component),
];

// less & image 目录
const styleDirs = [
    join(__dirname, 'node_modules'),
    join(configs.dir, directory.build.envName),
    join(configs.dir, directory.development.envName, directory.development.component),
    join(configs.dir, directory.development.envName, directory.development.sprite),
];


export default {
    output: {
        path: join(configs.dir, directory.production.envName),
        publicPath: configs.general.publicPath + '/',
        filename: directory.production.resource + '/' + directory.production.javascript + '/' + '[name]-[hash:10].js',
        chunkFilename: directory.production.resource + '/' + directory.production.javascript + '/' + '[name]-[chunkhash:10].js',
    },
    devtool: DEBUG ? 'cheap-module-eval-source-map' : '',
    // target:  ($PC && !$Web) ? 'electron-renderer' : 'web',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        extends: join(__dirname, '.babelrc'),
                        cacheDirectory: true,
                    }
                },
                exclude: /node_modules/,
            },
            // {
            //     test: /containers\/*\.js$/,
            //     use: [
            //         {
            //             loader: 'bundle-loader',
            //             options: {
            //                 lazy: true,
            //                 name: '[name]',
            //             }
            //         },
            //     ],
            //     include: join(configs.dir, directory.development.envName),
            // },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            'minimize': compiler.css.less.minimize,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            // sourceMap: compiler.css.less.sourceMap,
                            plugins: [
                                autoprefixer(compiler.css.postcss.autoprefixer),
                                ...$PC ? [] : [pxtorem(compiler.css.postcss.pxtorem)],
                            ],
                        },
                    },
                ],
                include: styleDirs,
            },
            {
                test: /\.less$/,
                use: DEBUG ? [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            'minimize': !compiler.css.less.minimize,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            // sourceMap: compiler.css.less.sourceMap,
                            plugins: [
                                autoprefixer(compiler.css.postcss.autoprefixer),
                                ...$PC ? [] : [pxtorem(compiler.css.postcss.pxtorem)],
                            ],
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            // sourceMap: compiler.css.less.sourceMap,
                            modifyVars: theme,
                        },
                    },
                ] : ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                'minimize': compiler.css.less.minimize,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                // sourceMap: compiler.css.less.sourceMap,
                                plugins: [
                                    autoprefixer(compiler.css.postcss.autoprefixer),
                                    ...$PC ? [] : [pxtorem(compiler.css.postcss.pxtorem)],
                                ],
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                // sourceMap: compiler.css.less.sourceMap,
                                modifyVars: theme,
                            },
                        },
                    ],
                }),
                include: styleDirs,
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name:  '[name]-[hash:10].[ext]',
                            limit: compiler.asset.image.optimizer.limit,
                            outputPath: directory.production.resource + '/' + directory.production.asset + '/',
                            // publicPath: '/',
                            // useRelativePath: process.env.NODE_ENV === "production",
                        }
                    },
                    'image-webpack-loader',
                ],
                include: styleDirs,
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: compiler.asset.svg.sprite.extract,
                            spriteFilename: directory.production.resource + '/' + directory.production.asset + '/' + 'sprite.svg',
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            svgo: {
                                plugins: [
                                    { cleanupAttrs: true },   // 清理属性换行和重复的空格
                                    { cleanupEnableBackground: true }, // 移除或清理 enable-background 属性
                                    { cleanupIDs: true },   // 清理未使用的 和 压缩使用的 ID
                                    { removeRasterImages: true }, // 移除栅格图标，默认值 false √
                                    { removeDimensions: true }, // 移除 width/height 属性，默认值 false √
                                    { removeStyleElement: true }, // 移除 <style> 元素，默认值 false √
                                ]
                            }
                        }
                    },
                ],
                include: svgDirs,
            },
        ]
    },
    plugins: [
        new HtmlPlugin({
            template: join(configs.dir, directory.development.envName, 'index.ejs'),
            inject: true,   // true: 'body', 'head'; false
            // filename: 'index.html',  // index.html
            title: compiler.html.title,
            description: compiler.html.description,
            keywords: compiler.html.keywords,
            favicon: join(configs.dir, directory.development.envName, 'favicon.ico'),
            bundle: configs.general.publicPath + '/' + assets.main.js,
            platform: platform,
            minify: DEBUG ? {} : {
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeScriptTypeAttributes: true,
                trimCustomFragments: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new webpack.DllReferencePlugin({
            context: configs.dir,
            manifest: require( join(configs.dir, '.build', 'manifest.json') ),
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        ...DEBUG ? [] : [
            new ExtractTextPlugin({
                filename: directory.production.resource + '/' + directory.production.style + '/' + '[name]-[hash:10].css',
                allChunks: true,
            }),
        ],
        ...compiler.asset.svg.sprite.extract ? [new SvgSpritePlugin()] : [],
        new SpritesmithPlugin({
            src: {
                cwd: join(configs.dir, directory.development.envName, directory.development.sprite),
                glob: '*.png',
            },
            target: {
                image: join(configs.dir, directory.build.envName, 'sprite.png'),
                css: join(configs.dir, directory.build.envName, 'sprite.less'),
            },
            apiOptions: {
                cssImageRef: 'sprite.png',
            },
        }),
    ],
    resolve: {
        alias: general.resolve.alias,
        // Ant Design Mobile（Web）：".web.js"
        extensions: general.resolve.extensions,
        // 普通版：main
        // ES2015+ Version：jsnext:main
        mainFields: general.resolve.mainFields,
        modules: [
            join(__dirname, 'node_modules'),
            join(configs.dir, directory.build.envName),
        ]
    },
    externals: general.externals,
    performance: {
        hints: DEBUG ? false : 'error',
        maxAssetSize: general.performance.maxAssetSize,
        maxEntrypointSize: general.performance.maxEntrypointSize,
    },
};

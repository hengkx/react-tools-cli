import { resolve, join } from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import commonConfig from './webpack.config.common';
import CleanPlugin from 'clean-webpack-plugin';

import configs, { platform, general, directory, debug, } from './.vd/project.json';

const DEBUG = process.env.NODE_ENV !== 'production';
const $PC = platform === 'pc';

if (DEBUG && configs.general.publicPath === '.') {
    configs.general.publicPath = '';
}

if (configs.dir === '__dirname') {
    configs.dir = __dirname;
}

// 动态获取本机 IP 地址
function getIpAdress() {
    const interfaces = require('os').networkInterfaces(); // eslint-disable-line global-require
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

const $host = getIpAdress();


export default merge.smart(commonConfig, {
    devServer: {
        host: $host,
        port: debug.port,
        hot: true,
        inline: true,
        historyApiFallback: true,
        compress: true,
        open: debug.browsersync.open,
        contentBase: join(configs.dir, directory.production.envName),
        publicPath: resolve(configs.general.publicPath, '/'),
    },
    entry: [
        'react-hot-loader/patch',
        join(configs.dir, directory.development.envName, 'index.js'),
    ],
    plugins: [
        new CleanPlugin([
            join(configs.dir, directory.production.envName, '*.html'),
        ]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        ...$PC ? [] : [
            new BrowserSyncPlugin({
                host: $host,
                port:  debug.browsersync.port,
                proxy:  'http://' + $host + ':' + debug.port,
                open:  debug.browsersync.open,
            }),
        ],
        new webpack.ProvidePlugin({
            'Mock': 'mockjs',
            'MockAdapter': 'axios-mock-adapter',
        }),
        new webpack.DefinePlugin({
            '__DEV__': true,
        }),
    ],
});

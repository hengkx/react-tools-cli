import createProject from './utils/createProject';

export { createProject };


// ./node_modules/.bin/cross-env accessKey=111 NODE_ENV=development node --trace-warnings -r  babel-register ./node_modules/webpack-dev-server/bin/webpack-dev-server --config webpack.config.dev.js
// console.log(process.env.accessKey)
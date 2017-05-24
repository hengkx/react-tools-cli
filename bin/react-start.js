#!/usr/bin/env node

const path = require('path');
const spawn = require('cross-spawn');
const args = process.argv.slice(2);

if (args.length > 0) {
  const react = path.join(process.env.APPDATA, 'react-tools-cli', 'react');
  // wrap(spawn('cmd.exe',
  // [`/c cd ${react} && node node_modules/.bin/cross-env id=${args[0]} NODE_ENV=development node --trace-warnings -r  babel-register ./node_modules/webpack-dev-server/bin/webpack-dev-server --config webpack.config.dev.js`]));

  wrap(spawn('cmd.exe', [`/c cd ${react} && npm run start${args[0]}`], { stdio: 'inherit' }));
}

function wrap(sp) {
  sp.on('close', function (code) {
    process.exit(code);
  });
  sp.on('close', function (code) {
    process.exit(code);
  });
}
console.log(args);

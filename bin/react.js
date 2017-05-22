#!/usr/bin/env node
'use strict';

const chalk = require('chalk');// 命令行颜色
const program = require('commander');// 提供了用户命令行输入和参数解析强大功能
const spawn = require('cross-spawn');
const join = require('path').join;
const exists = require('fs').existsSync;
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 });
notifier.notify();
// console.log(notifier);
// if (notifier.update) {
//   console.log(notifier.update);
// }
program
  .version(require('../package').version, '-v, --version')
  .usage('<command> [options]')
  .on('--help', printHelp)
  .parse(process.argv);

const aliases = {
  g: 'generate',
};
const args = process.argv.slice(3);
let subcmd = program.args[0];
if (aliases[subcmd]) subcmd = aliases[subcmd];

if (!subcmd) {
  program.help();
} else {
  const bin = executable(subcmd);
  if (bin) {
    wrap(spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] }));
  } else {
    program.help();
  }
}

function wrap(sp) {
  sp.on('close', function (code) {
    process.exit(code);
  });
}

function printHelp() {
  console.log('  Commands:');
  console.log();
  console.log('    init           Init a new dva application in the current folder');
  console.log('    new            Creates a new application');
  console.log('    generate       Generates new code (short-cut alias: "g")');
  console.log();
  console.log('  All commands can be run with -h (or --help) for more information.')
}

function executable(subcmd) {
  var file = join(__dirname, 'react-' + subcmd + '.js');
  if (exists(file)) {
    return file;
  }
}

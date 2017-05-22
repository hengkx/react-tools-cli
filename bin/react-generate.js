#!/usr/bin/env node

const program = require('commander');

program
  .option('--no-p, --no-progress', 'Don\'t generate progress')
  .option('--p, --no-params', 'Don\'t requst params')
  .option('-m, --method [method]', 'Specify request method, default get')
  .option('-i, --extraImport [extraImport]', 'Specify extraImport')
  .parse(process.argv);

require('../lib/generate')(program, {
  cwd: process.cwd(),
});
